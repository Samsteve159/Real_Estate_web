import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Manifest site V2 (agency positioning) — dev on :5181 so it runs alongside V1 (:5180).
export default defineConfig({
  // Served at "/" locally; the GitHub Pages build sets VITE_BASE="/Real_Estate_web/".
  base: (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5181,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
