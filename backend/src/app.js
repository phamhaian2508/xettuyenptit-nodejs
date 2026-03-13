import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: false
  })
);
app.use(express.json());
app.use("/api", router);

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || "Đã xảy ra lỗi hệ thống"
  });
});
