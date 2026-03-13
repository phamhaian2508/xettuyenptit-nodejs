import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import { encodePassword, matchesPassword } from "../utils/password.js";
import { findUserById } from "./authService.js";

export async function getAccountProfile(userId) {
  const user = await findUserById(userId);
  if (!user) {
    const error = new Error("Không tìm thấy người dùng");
    error.status = 404;
    throw error;
  }
  return user;
}

export async function updateAccountProfile(userId, payload) {
  await pool.query(
    `
      UPDATE user
      SET middle_name = ?,
          first_name = ?,
          email = ?,
          phone = ?,
          gender = ?,
          date_of_birth = ?,
          identity_number = ?,
          identity_issue_date = ?,
          identity_issue_place = ?,
          permanent_province = ?,
          permanent_district = ?,
          permanent_ward = ?,
          permanent_address = ?,
          modifieddate = NOW(),
          modifiedby = ?
      WHERE id = ?
    `,
    [
      payload.middleName || null,
      payload.firstName || null,
      payload.email || null,
      payload.phone || null,
      payload.gender || null,
      payload.dateOfBirth || null,
      payload.identityNumber || null,
      payload.identityIssueDate || null,
      payload.identityIssuePlace || null,
      payload.permanentProvince || null,
      payload.permanentDistrict || null,
      payload.permanentWard || null,
      payload.permanentAddress || null,
      payload.modifiedBy || "system",
      userId
    ]
  );

  return getAccountProfile(userId);
}

export async function updateAccountPassword(userId, payload) {
  const [rows] = await pool.query("SELECT id, password FROM user WHERE id = ? LIMIT 1", [userId]);
  if (!rows.length) {
    const error = new Error("Không tìm thấy người dùng");
    error.status = 404;
    throw error;
  }

  if (!matchesPassword(payload.oldPassword, rows[0].password) || payload.newPassword !== payload.confirmPassword) {
    const error = new Error("Mật khẩu cũ không đúng hoặc xác nhận mật khẩu mới chưa khớp");
    error.status = 400;
    throw error;
  }

  await pool.query(
    "UPDATE user SET password = ?, modifieddate = NOW(), modifiedby = ? WHERE id = ?",
    [encodePassword(payload.newPassword || env.defaultPassword), payload.modifiedBy || "system", userId]
  );

  return { message: "Đổi mật khẩu thành công" };
}
