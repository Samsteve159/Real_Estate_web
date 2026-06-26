import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Manifest site — new build on :5180 (clear of demo :5174, editorial :5173, Fresh_Build/website :5175)
export default defineConfig({
  // Served at "/" locally; the GitHub Pages build sets VITE_BASE="/Real_Estate_web/".
  base: (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
