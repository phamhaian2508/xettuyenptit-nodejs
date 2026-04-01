import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { parseCookieHeader } from "../utils/cookies.js";
import { findUserById } from "../services/authService.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const cookies = parseCookieHeader(req.headers.cookie || "");
    const token =
      (authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "") || cookies[env.authCookieName] || "";

    if (!token) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await findUserById(decoded.sub);

    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ" });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ" });
  }
}

export function requireRole(roleCode) {
  return function roleGuard(req, res, next) {
    if (!req.user?.roles?.includes(roleCode)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    return next();
  };
}
