import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import { createHttpError } from "../utils/errors.js";
import { encodePassword, matchesPassword } from "../utils/password.js";
import { mapUserRow } from "../utils/user.js";
import { writeAuditLog } from "./auditService.js";

const BASE_USER_QUERY = `
  SELECT
    u.id,
    u.username,
    u.password_hash,
    u.account_status,
    u.is_default_password,
    up.full_name,
    up.middle_name,
    up.first_name,
    up.email,
    up.phone,
    up.gender,
    up.date_of_birth,
    up.identity_number,
    up.identity_issue_date,
    up.identity_issue_place,
    up.permanent_province_code,
    up.permanent_province_name,
    up.permanent_district_code,
    up.permanent_district_name,
    up.permanent_ward_code,
    up.permanent_ward_name,
    up.permanent_address,
    up.contact_province_code,
    up.contact_province_name,
    up.contact_district_code,
    up.contact_district_name,
    up.contact_ward_code,
    up.contact_ward_name,
    up.contact_address,
    up.household_registration,
    c.id AS candidate_id,
    c.candidate_code,
    GROUP_CONCAT(r.code ORDER BY r.code SEPARATOR ',') AS roles
  FROM users u
  LEFT JOIN user_profiles up ON up.user_id = u.id
  LEFT JOIN candidates c ON c.user_id = u.id
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  LEFT JOIN roles r ON r.id = ur.role_id
`;

async function findSingleUser(whereClause, params) {
  const [rows] = await pool.query(
    `${BASE_USER_QUERY} ${whereClause} GROUP BY u.id LIMIT 1`,
    params
  );

  if (!rows.length) {
    return null;
  }

  return {
    raw: rows[0],
    user: mapUserRow(rows[0])
  };
}

export async function findUserByUsername(username) {
  const result = await findSingleUser("WHERE u.username = ?", [username]);
  return result?.user || null;
}

export async function findUserById(id) {
  const result = await findSingleUser("WHERE u.id = ?", [id]);
  return result?.user || null;
}

export async function login(username, password) {
  const result = await findSingleUser(
    "WHERE u.username = ? AND u.account_status = 'ACTIVE'",
    [username]
  );

  if (!result || !matchesPassword(password, result.raw.password_hash)) {
    throw createHttpError(401, "Tên đăng nhập hoặc mật khẩu không đúng");
  }

  if (result.raw.password_hash.startsWith("{noop}")) {
    await pool.query(
      `
        UPDATE users
        SET password_hash = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [encodePassword(password), result.user.id]
    );
  }

  await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = ?", [result.user.id]);

  const token = jwt.sign(
    {
      sub: result.user.id,
      username: result.user.userName,
      roles: result.user.roles
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  await writeAuditLog({
    userId: result.user.id,
    actionCode: result.user.isAdmin ? "ADMIN_LOGIN" : "CANDIDATE_LOGIN",
    actionName: "Dang nhap he thong",
    entityType: "USER",
    entityId: result.user.id,
    metadata: {
      username: result.user.userName,
      roles: result.user.roles
    }
  });

  return { token, user: result.user };
}
