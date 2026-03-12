import { app } from "./app.js";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  await pool.query("SELECT 1");
  app.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
