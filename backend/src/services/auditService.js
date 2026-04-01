import { pool } from "../config/db.js";

export async function writeAuditLog({
  userId = null,
  actionCode,
  actionName,
  entityType = null,
  entityId = null,
  metadata = null
}) {
  await pool.query(
    `
      INSERT INTO audit_logs (
        user_id,
        action_code,
        action_name,
        entity_type,
        entity_id,
        metadata_json
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      actionCode,
      actionName,
      entityType,
      entityId ? String(entityId) : null,
      metadata ? JSON.stringify(metadata) : null
    ]
  );
}
