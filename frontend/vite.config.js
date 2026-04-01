import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET || "http://localhost:8080";
  const devPort = Number(env.VITE_PORT || 5173);
  const previewPort = Number(env.VITE_PREVIEW_PORT || 4173);

  return {
    plugins: [react()],
    server: {
      host: true,
      port: devPort,
      proxy: {
        "/api": {
          target: devProxyTarget,
          changeOrigin: true
        }
      }
    },
    preview: {
      host: true,
      port: previewPort
    }
  };
});
