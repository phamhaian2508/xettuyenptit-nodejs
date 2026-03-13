import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

export const env = {
  port: Number(process.env.PORT || 8080),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "Anpham25$",
  dbName: process.env.DB_NAME || "xettuyenptitnodejs",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  defaultPassword: process.env.DEFAULT_PASSWORD || "123456"
};
