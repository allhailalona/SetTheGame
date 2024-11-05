import { fileURLToPath, URL } from "node:url";
import { resolve } from 'path'

import { defineConfig } from "vite"; // eslint-disable-line
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  envDir: resolve(__dirname, './'),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
