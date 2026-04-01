import { pool } from "../config/db.js";
import { toCsv } from "../utils/csv.js";
import { createHttpError } from "../utils/errors.js";
import {
  optionalEnum,
  optionalPositiveInt,
  optionalSearch,
  optionalText,
  parsePositiveInt
} from "../utils/validation.js";
import { writeAuditLog } from "./auditService.js";

const APPLICATION_STATUSES = [
  "NEW",
  "PENDING",
  "APPROVED",
  "SUPPLEMENT_REQUIRED",
  "REJECTED"
];

function buildApplicationFilters(filters = {}) {
  const conditions = [];
  const params = [];
  const search = optionalSearch(filters.search);
  const applicationCode = optionalText(filters.applicationCode, "Mã hồ sơ", { max: 50 });
  const fullName = optionalText(filters.fullName, "Họ tên", { max: 255 });
  const identityNumber = optionalText(filters.identityNumber, "CCCD", { max: 30 });
  const candidateCode = optionalText(filters.candidateCode, "Mã thí sinh", { max: 50 });
  const status = optionalEnum(filters.status, APPLICATION_STATUSES, "Trạng thái hồ sơ");
  const majorId = optionalPositiveInt(filters.majorId, "Ngành");
  const admissionPeriodId = optionalPositiveInt(filters.admissionPeriodId, "Đợt tuyển sinh");
  const likeValue = search ? `%${search}%` : null;

  if (likeValue) {
    conditions.push(
      "(aa.application_code LIKE ? OR c.candidate_code LIKE ? OR up.full_name LIKE ? OR up.identity_number LIKE ?)"
    );
    params.push(likeValue, likeValue, likeValue, likeValue);
  }

  if (applicationCode) {
    conditions.push("aa.application_code LIKE ?");
    params.push(`%${applicationCode}%`);
  }

  if (fullName) {
    conditions.push("up.full_name LIKE ?");
    params.push(`%${fullName}%`);
  }

  if (identityNumber) {
    conditions.push("up.identity_number LIKE ?");
    params.push(`%${identityNumber}%`);
  }

  if (candidateCode) {
    conditions.push("c.candidate_code LIKE ?");
    params.push(`%${candidateCode}%`);
  }

  if (status) {
    conditions.push("aa.status = ?");
    params.push(status);
  }

  if (majorId) {
    conditions.push("aa.major_id = ?");
    params.push(majorId);
  }

  if (admissionPeriodId) {
    conditions.push("aa.admission_period_id = ?");
    params.push(admissionPeriodId);
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params
  };
}

function buildCandidateFilters(filters = {}) {
  const conditions = [];
  const params = [];
  const search = optionalSearch(filters.search);
  const candidateCode = optionalText(filters.candidateCode, "Mã thí sinh", { max: 50 });
  const fullName = optionalText(filters.fullName, "Họ tên", { max: 255 });
  const identityNumber = optionalText(filters.identityNumber, "CCCD", { max: 30 });
  const majorId = optionalPositiveInt(filters.majorId, "Ngành");
  const admissionPeriodId = optionalPositiveInt(filters.admissionPeriodId, "Đợt tuyển sinh");
  const status = optionalEnum(filters.status, APPLICATION_STATUSES, "Trạng thái hồ sơ");
  const likeValue = search ? `%${search}%` : null;

  if (likeValue) {
    conditions.push("(c.candidate_code LIKE ? OR up.full_name LIKE ? OR up.identity_number LIKE ?)");
    params.push(likeValue, likeValue, likeValue);
  }

  if (candidateCode) {
    conditions.push("c.candidate_code LIKE ?");
    params.push(`%${candidateCode}%`);
  }

  if (fullName) {
    conditions.push("up.full_name LIKE ?");
    params.push(`%${fullName}%`);
  }

  if (identityNumber) {
    conditions.push("up.identity_number LIKE ?");
    params.push(`%${identityNumber}%`);
  }

  if (majorId) {
    conditions.push(
      "EXISTS (SELECT 1 FROM admission_applications aa WHERE aa.candidate_id = c.id AND aa.major_id = ?)"
    );
    params.push(majorId);
  }

  if (admissionPeriodId) {
    conditions.push(
      "EXISTS (SELECT 1 FROM admission_applications aa WHERE aa.candidate_id = c.id AND aa.admission_period_id = ?)"
    );
    params.push(admissionPeriodId);
  }

  if (status) {
    conditions.push(
      "EXISTS (SELECT 1 FROM admission_applications aa WHERE aa.candidate_id = c.id AND aa.status = ?)"
    );
    params.push(status);
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params
  };
}

function normalizePagination(query = {}) {
  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 10, 1), 100);
  return { page, pageSize, offset: (page - 1) * pageSize };
}

export async function getAdminDashboardSummary() {
  const [[applicationTotal]] = await pool.query(
    "SELECT COUNT(*) AS total FROM admission_applications"
  );
  const [[candidateTotal]] = await pool.query(
    "SELECT COUNT(*) AS total FROM candidates"
  );
  const [statusRows] = await pool.query(
    `
      SELECT status, COUNT(*) AS total
      FROM admission_applications
      GROUP BY status
      ORDER BY status
    `
  );
  const [recentApplications] = await pool.query(
    `
      SELECT
        aa.id,
        aa.application_code AS applicationCode,
        aa.status,
        aa.application_score AS applicationScore,
        aa.updated_at AS updatedAt,
        up.full_name AS fullName,
        up.identity_number AS identityNumber,
        c.candidate_code AS candidateCode,
        m.major_name AS majorName,
        m.specialization_name AS specializationName
      FROM admission_applications aa
      INNER JOIN candidates c ON c.id = aa.candidate_id
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      INNER JOIN majors m ON m.id = aa.major_id
      ORDER BY aa.updated_at DESC, aa.id DESC
      LIMIT 8
    `
  );

  const statusSummary = APPLICATION_STATUSES.map((status) => ({
    status,
    total: Number(statusRows.find((item) => item.status === status)?.total || 0)
  }));

  return {
    totalApplications: Number(applicationTotal.total || 0),
    totalCandidates: Number(candidateTotal.total || 0),
    statuses: statusSummary,
    recentApplications
  };
}

export async function listApplications(filters = {}) {
  const { whereClause, params } = buildApplicationFilters(filters);
  const { page, pageSize, offset } = normalizePagination(filters);

  const [[countRow]] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM admission_applications aa
      INNER JOIN candidates c ON c.id = aa.candidate_id
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      ${whereClause}
    `,
    params
  );

  const [rows] = await pool.query(
    `
      SELECT
        aa.id,
        aa.application_code AS applicationCode,
        aa.admission_year AS admissionYear,
        aa.combination_code AS combinationCode,
        aa.application_score AS applicationScore,
        aa.status,
        aa.note,
        aa.created_at AS createdAt,
        aa.updated_at AS updatedAt,
        c.id AS candidateId,
        c.candidate_code AS candidateCode,
        up.full_name AS fullName,
        up.identity_number AS identityNumber,
        ap.id AS admissionPeriodId,
        ap.name AS admissionPeriodName,
        m.id AS majorId,
        m.major_code AS majorCode,
        m.major_name AS majorName,
        m.specialization_name AS specializationName
      FROM admission_applications aa
      INNER JOIN candidates c ON c.id = aa.candidate_id
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      INNER JOIN admission_periods ap ON ap.id = aa.admission_period_id
      INNER JOIN majors m ON m.id = aa.major_id
      ${whereClause}
      ORDER BY aa.updated_at DESC, aa.id DESC
      LIMIT ? OFFSET ?
    `,
    [...params, pageSize, offset]
  );

  return {
    items: rows,
    pagination: {
      page,
      pageSize,
      total: Number(countRow.total || 0)
    }
  };
}

export async function getApplicationDetail(applicationId) {
  const normalizedApplicationId = parsePositiveInt(applicationId, "Hồ sơ");
  const [rows] = await pool.query(
    `
      SELECT
        aa.id,
        aa.application_code AS applicationCode,
        aa.admission_year AS admissionYear,
        aa.combination_code AS combinationCode,
        aa.application_score AS applicationScore,
        aa.status,
        aa.note,
        aa.created_at AS createdAt,
        aa.updated_at AS updatedAt,
        c.id AS candidateId,
        c.candidate_code AS candidateCode,
        c.graduation_year AS graduationYear,
        c.high_school_name AS highSchoolName,
        c.note AS candidateNote,
        up.full_name AS fullName,
        up.email,
        up.phone,
        up.gender,
        up.date_of_birth AS dateOfBirth,
        up.identity_number AS identityNumber,
        up.permanent_province_name AS permanentProvinceName,
        up.permanent_district_name AS permanentDistrictName,
        up.permanent_ward_name AS permanentWardName,
        up.permanent_address AS permanentAddress,
        ap.id AS admissionPeriodId,
        ap.code AS admissionPeriodCode,
        ap.name AS admissionPeriodName,
        ap.start_at AS admissionPeriodStartAt,
        ap.end_at AS admissionPeriodEndAt,
        m.id AS majorId,
        m.major_code AS majorCode,
        m.major_name AS majorName,
        m.specialization_code AS specializationCode,
        m.specialization_name AS specializationName
      FROM admission_applications aa
      INNER JOIN candidates c ON c.id = aa.candidate_id
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      INNER JOIN admission_periods ap ON ap.id = aa.admission_period_id
      INNER JOIN majors m ON m.id = aa.major_id
      WHERE aa.id = ?
      LIMIT 1
    `,
    [normalizedApplicationId]
  );

  if (!rows.length) {
    throw createHttpError(404, "Không tìm thấy hồ sơ");
  }

  const [logs] = await pool.query(
    `
      SELECT
        id,
        action_code AS actionCode,
        action_name AS actionName,
        metadata_json AS metadataJson,
        created_at AS createdAt
      FROM audit_logs
      WHERE entity_type = 'ADMISSION_APPLICATION'
        AND entity_id = ?
      ORDER BY created_at DESC, id DESC
    `,
    [String(normalizedApplicationId)]
  );

  return {
    ...rows[0],
    logs
  };
}

export async function updateApplicationStatus(applicationId, payload, actor) {
  const normalizedApplicationId = parsePositiveInt(applicationId, "Hồ sơ");
  const nextStatus = optionalEnum(payload?.status, APPLICATION_STATUSES, "Trạng thái hồ sơ");
  const note = optionalText(payload?.note, "Ghi chú", { max: 1000 });

  if (!nextStatus) {
    throw createHttpError(400, "Trạng thái hồ sơ không hợp lệ");
  }

  const [[currentRow]] = await pool.query(
    `
      SELECT id, application_code AS applicationCode, status
      FROM admission_applications
      WHERE id = ?
      LIMIT 1
    `,
    [normalizedApplicationId]
  );

  if (!currentRow) {
    throw createHttpError(404, "Không tìm thấy hồ sơ");
  }

  await pool.query(
    `
      UPDATE admission_applications
      SET status = ?,
          note = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [nextStatus, note, normalizedApplicationId]
  );

  await writeAuditLog({
    userId: actor.id,
    actionCode: "APPLICATION_STATUS_UPDATE",
    actionName: "Cap nhat trang thai ho so",
    entityType: "ADMISSION_APPLICATION",
    entityId: applicationId,
    metadata: {
      applicationCode: currentRow.applicationCode,
      from: currentRow.status,
      to: nextStatus,
      note
    }
  });

  return getApplicationDetail(normalizedApplicationId);
}

export async function listCandidates(filters = {}) {
  const { whereClause, params } = buildCandidateFilters(filters);
  const { page, pageSize, offset } = normalizePagination(filters);

  const [[countRow]] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM candidates c
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      ${whereClause}
    `,
    params
  );

  const [rows] = await pool.query(
    `
      SELECT
        c.id,
        c.candidate_code AS candidateCode,
        c.graduation_year AS graduationYear,
        c.high_school_name AS highSchoolName,
        c.note,
        u.username,
        u.account_status AS accountStatus,
        up.full_name AS fullName,
        up.email,
        up.phone,
        up.gender,
        up.date_of_birth AS dateOfBirth,
        up.identity_number AS identityNumber,
        COALESCE(stats.applicationCount, 0) AS applicationCount
      FROM candidates c
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      LEFT JOIN (
        SELECT candidate_id, COUNT(*) AS applicationCount
        FROM admission_applications
        GROUP BY candidate_id
      ) stats ON stats.candidate_id = c.id
      ${whereClause}
      ORDER BY c.created_at DESC, c.id DESC
      LIMIT ? OFFSET ?
    `,
    [...params, pageSize, offset]
  );

  return {
    items: rows,
    pagination: {
      page,
      pageSize,
      total: Number(countRow.total || 0)
    }
  };
}

export async function getCandidateDetail(candidateId) {
  const normalizedCandidateId = parsePositiveInt(candidateId, "Thí sinh");
  const [rows] = await pool.query(
    `
      SELECT
        c.id,
        c.candidate_code AS candidateCode,
        c.graduation_year AS graduationYear,
        c.high_school_name AS highSchoolName,
        c.note,
        u.id AS userId,
        u.username,
        u.account_status AS accountStatus,
        up.full_name AS fullName,
        up.middle_name AS middleName,
        up.first_name AS firstName,
        up.email,
        up.phone,
        up.gender,
        up.date_of_birth AS dateOfBirth,
        up.identity_number AS identityNumber,
        up.identity_issue_date AS identityIssueDate,
        up.identity_issue_place AS identityIssuePlace,
        up.permanent_province_name AS permanentProvinceName,
        up.permanent_district_name AS permanentDistrictName,
        up.permanent_ward_name AS permanentWardName,
        up.permanent_address AS permanentAddress,
        up.contact_province_name AS contactProvinceName,
        up.contact_district_name AS contactDistrictName,
        up.contact_ward_name AS contactWardName,
        up.contact_address AS contactAddress,
        up.household_registration AS householdRegistration
      FROM candidates c
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE c.id = ?
      LIMIT 1
    `,
    [normalizedCandidateId]
  );

  if (!rows.length) {
    throw createHttpError(404, "Không tìm thấy thí sinh");
  }

  const [applications] = await pool.query(
    `
      SELECT
        aa.id,
        aa.application_code AS applicationCode,
        aa.status,
        aa.application_score AS applicationScore,
        aa.combination_code AS combinationCode,
        aa.created_at AS createdAt,
        aa.updated_at AS updatedAt,
        ap.name AS admissionPeriodName,
        m.major_name AS majorName,
        m.specialization_name AS specializationName
      FROM admission_applications aa
      INNER JOIN admission_periods ap ON ap.id = aa.admission_period_id
      INNER JOIN majors m ON m.id = aa.major_id
      WHERE aa.candidate_id = ?
      ORDER BY aa.created_at DESC, aa.id DESC
    `,
    [normalizedCandidateId]
  );

  return {
    ...rows[0],
    applications
  };
}

export async function exportApplicationsCsv(filters = {}, actor) {
  const { whereClause, params } = buildApplicationFilters(filters);
  const [rows] = await pool.query(
    `
      SELECT
        aa.application_code AS applicationCode,
        c.candidate_code AS candidateCode,
        up.full_name AS fullName,
        up.identity_number AS identityNumber,
        ap.name AS admissionPeriodName,
        m.major_name AS majorName,
        m.specialization_name AS specializationName,
        aa.combination_code AS combinationCode,
        aa.application_score AS applicationScore,
        aa.status,
        aa.note,
        aa.updated_at AS updatedAt
      FROM admission_applications aa
      INNER JOIN candidates c ON c.id = aa.candidate_id
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      INNER JOIN admission_periods ap ON ap.id = aa.admission_period_id
      INNER JOIN majors m ON m.id = aa.major_id
      ${whereClause}
      ORDER BY aa.updated_at DESC, aa.id DESC
    `,
    params
  );

  await writeAuditLog({
    userId: actor.id,
    actionCode: "EXPORT_APPLICATIONS",
    actionName: "Xuat danh sach ho so",
    entityType: "ADMISSION_APPLICATION",
    metadata: filters
  });

  return toCsv(
    [
      { key: "applicationCode", label: "Ma ho so" },
      { key: "candidateCode", label: "Ma thi sinh" },
      { key: "fullName", label: "Ho ten" },
      { key: "identityNumber", label: "CCCD" },
      { key: "admissionPeriodName", label: "Dot tuyen sinh" },
      { key: "majorName", label: "Nganh" },
      { key: "specializationName", label: "Chuyen nganh" },
      { key: "combinationCode", label: "To hop" },
      { key: "applicationScore", label: "Diem" },
      { key: "status", label: "Trang thai" },
      { key: "note", label: "Ghi chu" },
      { key: "updatedAt", label: "Cap nhat luc" }
    ],
    rows
  );
}

export async function exportCandidatesCsv(filters = {}, actor) {
  const { whereClause, params } = buildCandidateFilters(filters);
  const [rows] = await pool.query(
    `
      SELECT
        c.candidate_code AS candidateCode,
        up.full_name AS fullName,
        up.identity_number AS identityNumber,
        up.email,
        up.phone,
        up.gender,
        up.date_of_birth AS dateOfBirth,
        c.graduation_year AS graduationYear,
        c.high_school_name AS highSchoolName,
        u.username,
        u.account_status AS accountStatus
      FROM candidates c
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC, c.id DESC
    `,
    params
  );

  await writeAuditLog({
    userId: actor.id,
    actionCode: "EXPORT_CANDIDATES",
    actionName: "Xuat danh sach thi sinh",
    entityType: "CANDIDATE",
    metadata: filters
  });

  return toCsv(
    [
      { key: "candidateCode", label: "Ma thi sinh" },
      { key: "fullName", label: "Ho ten" },
      { key: "identityNumber", label: "CCCD" },
      { key: "email", label: "Email" },
      { key: "phone", label: "So dien thoai" },
      { key: "gender", label: "Gioi tinh" },
      { key: "dateOfBirth", label: "Ngay sinh" },
      { key: "graduationYear", label: "Nam tot nghiep" },
      { key: "highSchoolName", label: "Truong THPT" },
      { key: "username", label: "Tai khoan" },
      { key: "accountStatus", label: "Trang thai tai khoan" }
    ],
    rows
  );
}
