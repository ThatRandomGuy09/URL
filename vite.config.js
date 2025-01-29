import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://url-backend-fczi.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
