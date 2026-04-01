import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../..");
const repoRoot = path.resolve(backendRoot, "..");

for (const candidatePath of [
  path.join(backendRoot, ".env"),
  path.join(repoRoot, ".env")
]) {
  dotenv.config({ path: candidatePath, override: false });
}

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return String(value).trim().toLowerCase() === "true";
}

function parseOrigins(value) {
  const rawOrigins = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return rawOrigins.length ? rawOrigins : ["http://localhost:5173"];
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8080),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL),
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "xettuyenptitnodejs",
  jwtSecret: process.env.JWT_SECRET || crypto.randomUUID(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  defaultPassword: process.env.DEFAULT_PASSWORD || "",
  authCookieName: process.env.AUTH_COOKIE_NAME || "ptit_auth",
  authCookieMaxAgeSeconds: Number(process.env.AUTH_COOKIE_MAX_AGE_SECONDS || 60 * 60 * 8),
  secureCookies: parseBoolean(process.env.SECURE_COOKIES, process.env.NODE_ENV === "production"),
  documentUploadsDir:
    process.env.DOCUMENT_UPLOADS_DIR || path.resolve(backendRoot, "document-uploads")
};
