import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tailwindRuntime from "./src/tw-runtime/tw-runtime";
import { codeUpdaterEndpoint } from "./src/utils/codeUpdaterEndpoint.js";
import { elementUpdater } from "./src/utils/elementUpdater.js";
import { deleteUpdater } from "./src/utils/deleteElement.js";
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
      name: "quick-style-server-endpoints",
      configureServer(server) {
        codeUpdaterEndpoint(server);
        elementUpdater(server);
        deleteUpdater(server);
      }
    },
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'QuickStyle',
      fileName: 'index',
      formats: ['es'] 
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom', 
        'react/jsx-runtime', 
        'fs', 
        'path', 
        'url'
      ],
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