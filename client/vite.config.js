import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // this enables SPA fallback for dev server
  },
  build: {
    outDir: "dist",
  },
});
