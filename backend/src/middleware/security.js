import crypto from "crypto";
import { env } from "../config/env.js";

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "unknown";
}

export function applySecurityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  next();
}

export function attachRequestId(req, res, next) {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}

export function createRateLimiter({ windowMs, maxRequests, message, keyBuilder }) {
  const entries = new Map();

  return function rateLimiter(req, res, next) {
    const now = Date.now();
    const key = keyBuilder ? keyBuilder(req) : getClientIp(req);
    const current = entries.get(key);

    if (!current || now > current.resetAt) {
      entries.set(key, {
        count: 1,
        resetAt: now + windowMs
      });
      return next();
    }

    if (current.count >= maxRequests) {
      res.setHeader("Retry-After", Math.ceil((current.resetAt - now) / 1000));
      return res.status(429).json({
        message,
        requestId: req.requestId
      });
    }

    current.count += 1;
    return next();
  };
}

export function setAuthCookie(res, token) {
  const parts = [
    `${env.authCookieName}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${env.authCookieMaxAgeSeconds}`
  ];

  if (env.secureCookies) {
    parts.push("Secure");
  }

  res.setHeader("Set-Cookie", parts.join("; "));
}

export function clearAuthCookie(res) {
  const parts = [
    `${env.authCookieName}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0"
  ];

  if (env.secureCookies) {
    parts.push("Secure");
  }

  res.setHeader("Set-Cookie", parts.join("; "));
}
