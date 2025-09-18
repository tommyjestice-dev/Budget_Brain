// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Ensures every dependency (including Recharts) uses the SAME React instance
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    // Pre-bundle these to avoid weird multiple copies at runtime
    include: ["react", "react-dom"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
