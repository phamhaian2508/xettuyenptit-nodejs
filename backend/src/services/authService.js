import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import { matchesPassword } from "../utils/password.js";
import { mapUserRow } from "../utils/user.js";

const BASE_USER_QUERY = `
  SELECT
    u.id,
    u.username,
    u.password,
    u.status,
    u.email,
    u.middle_name,
    u.first_name,
    u.phone,
    u.gender,
    u.date_of_birth,
    u.identity_number,
    u.identity_issue_date,
    u.identity_issue_place,
    u.permanent_province,
    u.permanent_district,
    u.permanent_ward,
    u.permanent_address,
    GROUP_CONCAT(r.code ORDER BY r.code SEPARATOR ',') AS roles
  FROM user u
  LEFT JOIN user_role ur ON ur.user_id = u.id
  LEFT JOIN role r ON r.id = ur.role_id
`;

export async function findUserByUsername(username) {
  const [rows] = await pool.query(
    `${BASE_USER_QUERY} WHERE u.username = ? GROUP BY u.id LIMIT 1`,
    [username]
  );

  if (!rows.length) {
    return null;
  }

  return mapUserRow(rows[0]);
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    `${BASE_USER_QUERY} WHERE u.id = ? GROUP BY u.id LIMIT 1`,
    [id]
  );

  if (!rows.length) {
    return null;
  }

  return mapUserRow(rows[0]);
}

export async function login(username, password) {
  const [rows] = await pool.query(
    `${BASE_USER_QUERY} WHERE u.username = ? AND u.status = 1 GROUP BY u.id LIMIT 1`,
    [username]
  );

  if (!rows.length || !matchesPassword(password, rows[0].password)) {
    const error = new Error("Tên đăng nhập hoặc mật khẩu không đúng");
    error.status = 401;
    throw error;
  }

  const user = mapUserRow(rows[0]);
  const token = jwt.sign(
    {
      sub: user.id,
      username: user.userName,
      roles: user.roles
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return { token, user };
}
