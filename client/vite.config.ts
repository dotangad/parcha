import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      // You can add aliases for your imports here if needed
    },
  },
  server: {
    port: 8000,
  },
});
