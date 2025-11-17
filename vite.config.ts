import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  base: "",
  plugins: [react()],
  build: {
    assetsInlineLimit: 0
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      ignored: [
        "**/public/images/**",
      ]
    }
  },
});
