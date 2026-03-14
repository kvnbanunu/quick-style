import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tailwindRuntime from "./src/tw-runtime/tw-runtime";
import { codeUpdaterEndpoint } from "./src/utils/codeUpdaterEndpoint.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["./src/utils/babel-plugin-source.js"],
      },
    }),
    tailwindcss(),
    tailwindRuntime(),
    {
      name: "quick-style-api",
      configureServer(server) {
        codeUpdaterEndpoint(server);
      }
    },
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'QuickStyle',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        },
      },
    },
  },
});
