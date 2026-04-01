import { app } from "./app.js";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  await pool.query("SELECT 1");

  if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET is not set. A temporary in-memory secret is being used for this session.");
  }

  app.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  if (error?.code === "ER_ACCESS_DENIED_ERROR") {
    console.error("Khong ket noi duoc MySQL: sai DB_USER/DB_PASSWORD hoac chua tao backend/.env.");
    console.error("Hay tao file backend/.env tu backend/.env.example va dien dung thong tin MySQL.");
  }

  console.error("Failed to start backend", error);
  process.exit(1);
});
