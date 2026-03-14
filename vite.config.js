import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tailwindRuntime from "./src/tw-runtime/tw-runtime";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["./src/utils/babel-plugin-source.js"],
      },
    }),
    tailwindcss(),
    tailwindRuntime(),
  ],
});
