import { pool } from "../config/db.js";
import { createHttpError, isMysqlDuplicateError } from "../utils/errors.js";
import { encodePassword, matchesPassword } from "../utils/password.js";
import {
  optionalDate,
  optionalEmail,
  optionalEnum,
  optionalPhone,
  optionalText,
  validatePasswordStrength
} from "../utils/validation.js";
import { findUserById } from "./authService.js";
import { writeAuditLog } from "./auditService.js";

function normalizeProfilePayload(payload) {
  const fullName = payload.fullName || `${payload.middleName || ""} ${payload.firstName || ""}`.trim();

  return {
    fullName: optionalText(fullName || payload.userName || "Người dùng", "Họ tên", { max: 255 }) || "Người dùng",
    middleName: optionalText(payload.middleName, "Họ đệm", { max: 100 }),
    firstName: optionalText(payload.firstName, "Tên", { max: 100 }),
    email: optionalEmail(payload.email),
    phone: optionalPhone(payload.phone),
    gender: optionalEnum(payload.gender, ["Nam", "Nữ", "Khác"], "Giới tính"),
    dateOfBirth: optionalDate(payload.dateOfBirth, "Ngày sinh"),
    identityNumber: optionalText(payload.identityNumber, "CCCD", { max: 30 }),
    identityIssueDate: optionalDate(payload.identityIssueDate, "Ngày cấp"),
    identityIssuePlace: optionalText(payload.identityIssuePlace, "Nơi cấp", { max: 255 }),
    permanentProvinceCode: optionalText(payload.permanentProvinceCode, "Mã tỉnh thường trú", { max: 30 }),
    permanentProvinceName: optionalText(payload.permanentProvinceName, "Tỉnh thường trú", { max: 255 }),
    permanentDistrictCode: optionalText(payload.permanentDistrictCode, "Mã quận huyện thường trú", { max: 30 }),
    permanentDistrictName: optionalText(payload.permanentDistrictName, "Quận huyện thường trú", { max: 255 }),
    permanentWardCode: optionalText(payload.permanentWardCode, "Mã phường xã thường trú", { max: 30 }),
    permanentWardName: optionalText(payload.permanentWardName, "Phường xã thường trú", { max: 255 }),
    permanentAddress: optionalText(payload.permanentAddress, "Địa chỉ thường trú", { max: 500 }),
    contactProvinceCode: optionalText(payload.contactProvinceCode, "Mã tỉnh liên hệ", { max: 30 }),
    contactProvinceName: optionalText(payload.contactProvinceName, "Tỉnh liên hệ", { max: 255 }),
    contactDistrictCode: optionalText(payload.contactDistrictCode, "Mã quận huyện liên hệ", { max: 30 }),
    contactDistrictName: optionalText(payload.contactDistrictName, "Quận huyện liên hệ", { max: 255 }),
    contactWardCode: optionalText(payload.contactWardCode, "Mã phường xã liên hệ", { max: 30 }),
    contactWardName: optionalText(payload.contactWardName, "Phường xã liên hệ", { max: 255 }),
    contactAddress: optionalText(payload.contactAddress, "Địa chỉ liên hệ", { max: 500 }),
    householdRegistration: optionalText(payload.householdRegistration, "Hộ khẩu thường trú", { max: 500 })
  };
}

export async function getAccountProfile(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw createHttpError(404, "Không tìm thấy người dùng");
  }

  return user;
}

export async function updateAccountProfile(userId, payload) {
  const profile = normalizeProfilePayload(payload);

  try {
    await pool.query(
      `
        INSERT INTO user_profiles (
          user_id,
          full_name,
          middle_name,
          first_name,
          email,
          phone,
          gender,
          date_of_birth,
          identity_number,
          identity_issue_date,
          identity_issue_place,
          permanent_province_code,
          permanent_province_name,
          permanent_district_code,
          permanent_district_name,
          permanent_ward_code,
          permanent_ward_name,
          permanent_address,
          contact_province_code,
          contact_province_name,
          contact_district_code,
          contact_district_name,
          contact_ward_code,
          contact_ward_name,
          contact_address,
          household_registration
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          middle_name = VALUES(middle_name),
          first_name = VALUES(first_name),
          email = VALUES(email),
          phone = VALUES(phone),
          gender = VALUES(gender),
          date_of_birth = VALUES(date_of_birth),
          identity_number = VALUES(identity_number),
          identity_issue_date = VALUES(identity_issue_date),
          identity_issue_place = VALUES(identity_issue_place),
          permanent_province_code = VALUES(permanent_province_code),
          permanent_province_name = VALUES(permanent_province_name),
          permanent_district_code = VALUES(permanent_district_code),
          permanent_district_name = VALUES(permanent_district_name),
          permanent_ward_code = VALUES(permanent_ward_code),
          permanent_ward_name = VALUES(permanent_ward_name),
          permanent_address = VALUES(permanent_address),
          contact_province_code = VALUES(contact_province_code),
          contact_province_name = VALUES(contact_province_name),
          contact_district_code = VALUES(contact_district_code),
          contact_district_name = VALUES(contact_district_name),
          contact_ward_code = VALUES(contact_ward_code),
          contact_ward_name = VALUES(contact_ward_name),
          contact_address = VALUES(contact_address),
          household_registration = VALUES(household_registration),
          updated_at = CURRENT_TIMESTAMP
      `,
      [
        userId,
        profile.fullName,
        profile.middleName,
        profile.firstName,
        profile.email,
        profile.phone,
        profile.gender,
        profile.dateOfBirth,
        profile.identityNumber,
        profile.identityIssueDate,
        profile.identityIssuePlace,
        profile.permanentProvinceCode,
        profile.permanentProvinceName,
        profile.permanentDistrictCode,
        profile.permanentDistrictName,
        profile.permanentWardCode,
        profile.permanentWardName,
        profile.permanentAddress,
        profile.contactProvinceCode,
        profile.contactProvinceName,
        profile.contactDistrictCode,
        profile.contactDistrictName,
        profile.contactWardCode,
        profile.contactWardName,
        profile.contactAddress,
        profile.householdRegistration
      ]
    );
  } catch (error) {
    if (isMysqlDuplicateError(error)) {
      throw createHttpError(409, "Email hoặc CCCD đã tồn tại trong hệ thống");
    }

    throw error;
  }

  await writeAuditLog({
    userId,
    actionCode: "PROFILE_UPDATE",
    actionName: "Cap nhat thong tin ca nhan",
    entityType: "USER",
    entityId: userId
  });

  return getAccountProfile(userId);
}

export async function updateAccountPassword(userId, payload) {
  const [rows] = await pool.query(
    "SELECT id, username, password_hash FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  if (!rows.length) {
    throw createHttpError(404, "Không tìm thấy người dùng");
  }

  if (!payload.oldPassword || !payload.newPassword || !payload.confirmPassword) {
    throw createHttpError(400, "Cần nhập đầy đủ mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu");
  }

  if (!matchesPassword(payload.oldPassword, rows[0].password_hash)) {
    throw createHttpError(400, "Mật khẩu cũ không đúng");
  }

  if (payload.newPassword !== payload.confirmPassword) {
    throw createHttpError(400, "Xác nhận mật khẩu mới chưa khớp");
  }

  if (payload.oldPassword === payload.newPassword) {
    throw createHttpError(400, "Mật khẩu mới phải khác mật khẩu cũ");
  }

  validatePasswordStrength(payload.newPassword);

  await pool.query(
    `
      UPDATE users
      SET password_hash = ?,
          is_default_password = 0,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [encodePassword(payload.newPassword), userId]
  );

  await writeAuditLog({
    userId,
    actionCode: "PASSWORD_CHANGE",
    actionName: "Doi mat khau",
    entityType: "USER",
    entityId: userId
  });

  return { message: "Doi mat khau thanh cong" };
}
