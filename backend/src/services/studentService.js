import { pool } from "../config/db.js";
import { optionalPositiveInt } from "../utils/validation.js";

export async function getGuidesForUser(user) {
  const roleTargets = user.isAdmin ? ["ALL", "ADMIN"] : ["ALL", "CANDIDATE"];
  const [rows] = await pool.query(
    `
      SELECT id, title, content, target_role AS targetRole, created_at AS createdAt
      FROM application_guides
      WHERE is_active = 1
        AND target_role IN (?, ?)
      ORDER BY id DESC
    `,
    roleTargets
  );

  return rows;
}

export async function getNotificationsForUser(userId) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        title,
        content,
        notification_type AS notificationType,
        is_read AS isRead,
        created_at AS createdAt
      FROM notifications
      WHERE user_id IS NULL OR user_id = ?
      ORDER BY created_at DESC, id DESC
    `,
    [userId]
  );

  return rows;
}

export async function getAdmissionPeriods(admissionYear) {
  const params = [];
  let whereClause = "";
  const normalizedAdmissionYear = optionalPositiveInt(admissionYear, "Năm tuyển sinh");

  if (normalizedAdmissionYear) {
    whereClause = "WHERE admission_year = ?";
    params.push(normalizedAdmissionYear);
  }

  const [rows] = await pool.query(
    `
      SELECT
        id,
        admission_year AS admissionYear,
        code,
        name,
        start_at AS startAt,
        end_at AS endAt,
        status,
        description
      FROM admission_periods
      ${whereClause}
      ORDER BY admission_year DESC, start_at ASC
    `,
    params
  );

  return rows;
}

export async function getMajors() {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        major_code AS majorCode,
        major_name AS majorName,
        specialization_code AS specializationCode,
        specialization_name AS specializationName,
        is_active AS isActive,
        sort_order AS sortOrder
      FROM majors
      WHERE is_active = 1
      ORDER BY sort_order ASC, id ASC
    `
  );

  return rows;
}

export async function getMyApplications(user) {
  if (!user.candidateId) {
    return [];
  }

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
        ap.id AS admissionPeriodId,
        ap.code AS admissionPeriodCode,
        ap.name AS admissionPeriodName,
        m.id AS majorId,
        m.major_code AS majorCode,
        m.major_name AS majorName,
        m.specialization_code AS specializationCode,
        m.specialization_name AS specializationName
      FROM admission_applications aa
      INNER JOIN admission_periods ap ON ap.id = aa.admission_period_id
      INNER JOIN majors m ON m.id = aa.major_id
      WHERE aa.candidate_id = ?
      ORDER BY aa.created_at DESC, aa.id DESC
    `,
    [user.candidateId]
  );

  return rows;
}
