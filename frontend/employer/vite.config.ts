// @ts-nocheck
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const apiProxyTarget = process.env.VITE_PROXY_TARGET ?? "http://127.0.0.1:8000";

// https://vitejs.dev/config/
// hi
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8082,
    proxy: {
      "/api": {
        // Employer/Admin backend (FastAPI)
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
        // strip the /api prefix so FastAPI sees /employer/profile
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    host: "::",
    port: 8082,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
