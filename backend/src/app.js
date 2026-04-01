import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { applySecurityHeaders, attachRequestId } from "./middleware/security.js";
import { router } from "./routes/index.js";
import { isClientErrorStatus } from "./utils/errors.js";

export const app = express();

app.disable("x-powered-by");
app.use(attachRequestId);
app.use(applySecurityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin khong duoc phep"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use("/api", router);

app.use((error, req, res, _next) => {
  const status = error.status || 500;
  const isClientError = isClientErrorStatus(status);

  if (!isClientError) {
    console.error("Unhandled error", {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      message: error.message,
      stack: error.stack
    });
  }

  res.status(status).json({
    message: isClientError ? error.message : "Đã xảy ra lỗi hệ thống",
    requestId: req.requestId
  });
});
