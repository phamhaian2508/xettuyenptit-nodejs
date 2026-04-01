import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { env } from "../config/env.js";
import { pool } from "../config/db.js";
import { createHttpError } from "../utils/errors.js";
import { parsePositiveInt, requiredText } from "../utils/validation.js";
import { findUserById } from "./authService.js";

const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "text/plain"
];
const MAX_DOCUMENT_SIZE_BYTES = 256 * 1024;
const IMPORT_TIMEOUT_MS = 4000;
const PREVIEW_LIMIT = 240;
const INTERNAL_REVIEW_SERVICE_CODE = "INTERNAL_REVIEW";

function maskEmail(email) {
  const [localPart = "", domain = ""] = String(email || "").split("@");

  if (!localPart || !domain) {
    return null;
  }

  if (localPart.length < 3) {
    return `***@${domain}`;
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^A-Za-z0-9._-]/g, "_");
}

function buildPreviewText(buffer) {
  return buffer
    .toString("utf8")
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, PREVIEW_LIMIT);
}

async function ensureUploadsDirectory() {
  await fs.mkdir(env.documentUploadsDir, { recursive: true });
}

async function getOwnedApplication(applicationId, actor) {
  const normalizedApplicationId = parsePositiveInt(applicationId, "Ho so");
  const [rows] = await pool.query(
    `
      SELECT
        aa.id,
        aa.application_code AS applicationCode,
        aa.status,
        aa.candidate_id AS candidateId
      FROM admission_applications aa
      WHERE aa.id = ?
        AND aa.candidate_id = ?
      LIMIT 1
    `,
    [normalizedApplicationId, actor.candidateId]
  );

  if (!rows.length) {
    throw createHttpError(403, "Ban khong duoc thao tac voi ho so nay");
  }

  return rows[0];
}

async function persistApplicationDocument({
  applicationId,
  actor,
  fileName,
  mimeType,
  buffer,
  sourceType,
  sourceUrl
}) {
  const storageKey = `${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(fileName)}`;
  const targetPath = path.join(env.documentUploadsDir, storageKey);
  const previewText = buildPreviewText(buffer);

  await ensureUploadsDirectory();
  await fs.writeFile(targetPath, buffer);

  const [result] = await pool.query(
    `
      INSERT INTO application_documents (
        application_id,
        uploaded_by,
        source_type,
        original_name,
        mime_type,
        storage_key,
        file_size_bytes,
        preview_text,
        source_url,
        processing_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'STORED')
    `,
    [
      applicationId,
      actor.id,
      sourceType,
      fileName,
      mimeType,
      storageKey,
      buffer.length,
      previewText || null,
      sourceUrl || null
    ]
  );

  return {
    id: result.insertId,
    originalName: fileName,
    mimeType,
    fileSizeBytes: buffer.length,
    previewText,
    sourceType,
    sourceUrl,
    processingStatus: "STORED"
  };
}

function normalizeBufferFromBase64(contentBase64) {
  const normalizedContent = requiredText(contentBase64, "Noi dung tep", { max: 800000 });
  const buffer = Buffer.from(normalizedContent, "base64");

  if (!buffer.length) {
    throw createHttpError(400, "Noi dung tep khong hop le");
  }

  if (buffer.length > MAX_DOCUMENT_SIZE_BYTES) {
    throw createHttpError(400, "Tep vuot qua gioi han 256KB");
  }

  return buffer;
}

async function getInternalReviewToken() {
  const [rows] = await pool.query(
    `
      SELECT
        service_code AS serviceCode,
        access_token AS accessToken,
        note
      FROM internal_service_tokens
      WHERE service_code = ?
      LIMIT 1
    `,
    [INTERNAL_REVIEW_SERVICE_CODE]
  );

  if (!rows.length) {
    throw createHttpError(500, "Khong tim thay token noi bo");
  }

  return rows[0];
}

async function ensureRoleAssigned(userId, roleCode) {
  await pool.query(
    `
      INSERT IGNORE INTO user_roles (user_id, role_id)
      SELECT ?, id
      FROM roles
      WHERE code = ?
    `,
    [userId, roleCode]
  );
}

async function hasImportedInternalReview(actor) {
  const [rows] = await pool.query(
    `
      SELECT id
      FROM application_documents
      WHERE uploaded_by = ?
        AND source_type = 'URL_IMPORT'
        AND source_url LIKE ?
      LIMIT 1
    `,
    [actor.id, "%/api/internal/review/report%"]
  );

  return rows.length > 0;
}

export async function runSupportRecoveryPrecheck(query = {}) {
  const username = requiredText(query.username, "Ten dang nhap", { max: 100 });
  const recoveryChannel = requiredText(query.channel || "LEGACY_HELPDESK", "Kenh ho tro", {
    max: 50
  });

  const vulnerableQuery = `
    SELECT
      id,
      username,
      contact_email AS contactEmail
    FROM support_recovery_requests
    WHERE status = 'OPEN'
      AND recovery_channel = '${recoveryChannel}'
      AND username = '${username}'
    LIMIT 1
  `;

  const [rows] = await pool.query(vulnerableQuery);

  return {
    exists: rows.length > 0,
    maskedContact: rows.length ? maskEmail(rows[0].contactEmail) : null,
    requestRef: rows.length ? `LEG-${String(rows[0].id).padStart(4, "0")}` : null
  };
}

export async function listApplicationDocuments(applicationId, actor) {
  const application = await getOwnedApplication(applicationId, actor);
  const [rows] = await pool.query(
    `
      SELECT
        id,
        source_type AS sourceType,
        original_name AS originalName,
        mime_type AS mimeType,
        file_size_bytes AS fileSizeBytes,
        preview_text AS previewText,
        source_url AS sourceUrl,
        processing_status AS processingStatus,
        created_at AS createdAt
      FROM application_documents
      WHERE application_id = ?
      ORDER BY created_at DESC, id DESC
    `,
    [application.id]
  );

  return {
    application,
    items: rows
  };
}

export async function uploadApplicationDocument(applicationId, payload, actor) {
  const application = await getOwnedApplication(applicationId, actor);
  const fileName = requiredText(payload?.fileName, "Ten tep", { max: 255 });
  const mimeType = requiredText(payload?.mimeType, "Loai tep", { max: 120 });

  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(mimeType)) {
    throw createHttpError(400, "Loai tep khong duoc ho tro");
  }

  const buffer = normalizeBufferFromBase64(payload?.contentBase64);
  const item = await persistApplicationDocument({
    applicationId: application.id,
    actor,
    fileName,
    mimeType,
    buffer,
    sourceType: "UPLOAD",
    sourceUrl: null
  });

  return {
    application,
    item
  };
}

function deriveFileNameFromUrl(sourceUrl) {
  const pathname = new URL(sourceUrl).pathname || "";
  const lastSegment = pathname.split("/").filter(Boolean).pop();
  return sanitizeFileName(lastSegment || "imported-preview.txt");
}

export async function importApplicationDocumentFromUrl(applicationId, payload, actor) {
  const application = await getOwnedApplication(applicationId, actor);
  const sourceUrl = requiredText(payload?.sourceUrl, "URL nguon", { max: 500 });
  const parsedUrl = new URL(sourceUrl);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw createHttpError(400, "Chi ho tro URL http/https");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), IMPORT_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(parsedUrl, {
      signal: controller.signal,
      redirect: "follow"
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw createHttpError(504, "Het thoi gian tai noi dung tu URL");
    }

    throw createHttpError(502, "Khong the tai noi dung tu URL");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw createHttpError(502, `URL tra ve trang thai ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!buffer.length) {
    throw createHttpError(400, "URL khong tra ve du lieu de luu");
  }

  if (buffer.length > MAX_DOCUMENT_SIZE_BYTES) {
    throw createHttpError(400, "Noi dung tai ve vuot qua gioi han 256KB");
  }

  const fileName = payload?.fileName
    ? requiredText(payload.fileName, "Ten tep", { max: 255 })
    : deriveFileNameFromUrl(sourceUrl);
  const mimeType = response.headers.get("content-type")?.split(";")[0]?.trim() || "text/plain";
  const item = await persistApplicationDocument({
    applicationId: application.id,
    actor,
    fileName,
    mimeType,
    buffer,
    sourceType: "URL_IMPORT",
    sourceUrl
  });

  return {
    application,
    item
  };
}

export async function getInternalReviewReport() {
  const [documents] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM application_documents
    `
  );
  const token = await getInternalReviewToken();

  return {
    service: "internal-review",
    reportId: "IR-2026-PTIT",
    previewToken: token.accessToken,
    storedDocuments: Number(documents[0]?.total || 0),
    storagePath: env.documentUploadsDir,
    maintenanceEndpoint: "/api/internal/ops/bootstrap",
    note: "Internal preview service used by the import URL feature.",
    nextHint: "Use previewToken against the maintenance bootstrap endpoint after importing this report."
  };
}

export async function bootstrapRootAccess(actor, payload = {}) {
  const maintenanceToken = requiredText(payload.maintenanceToken, "Maintenance token", {
    max: 120
  });
  const token = await getInternalReviewToken();
  const importedInternalReview = await hasImportedInternalReview(actor);

  if (!importedInternalReview) {
    throw createHttpError(403, "Can import bao cao noi bo truoc khi bootstrap");
  }

  if (maintenanceToken !== token.accessToken) {
    throw createHttpError(403, "Maintenance token khong hop le");
  }

  await ensureRoleAssigned(actor.id, "ROOT");
  await ensureRoleAssigned(actor.id, "ADMIN");
  const updatedUser = await findUserById(actor.id);

  return {
    elevated: true,
    roles: updatedUser?.roles || [],
    nextPath: "/admin/dashboard"
  };
}

export async function getRootConsole(actor) {
  const [documentRows] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM application_documents
    `
  );
  const [candidateRows] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM candidates
    `
  );
  const [recentDocuments] = await pool.query(
    `
      SELECT
        id,
        original_name AS originalName,
        source_type AS sourceType,
        source_url AS sourceUrl,
        created_at AS createdAt
      FROM application_documents
      ORDER BY created_at DESC, id DESC
      LIMIT 5
    `
  );

  return {
    consoleId: "ROOT-CONSOLE-PTIT-2026",
    currentUser: {
      id: actor.id,
      userName: actor.userName,
      roles: actor.roles
    },
    services: {
      databaseHost: env.dbHost,
      databaseName: env.dbName,
      uploadsDirectory: env.documentUploadsDir,
      cookieName: env.authCookieName
    },
    summary: {
      totalCandidates: Number(candidateRows[0]?.total || 0),
      totalDocuments: Number(documentRows[0]?.total || 0)
    },
    recentDocuments,
    rootFlag: "ROOT-APP-CONSOLE-2026-PTIT"
  };
}
