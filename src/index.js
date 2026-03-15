import './index.css';

export { default as QuickStyle } from './components/QuickStyle.jsx';
import { codeUpdaterEndpoint } from "./utils/codeUpdaterEndpoint.js";
import { deleteUpdater } from './utils/deleteElement.js';
import { elementUpdater } from "./utils/elementUpdater.js";
import tailwindRuntime from "./tw-runtime/tw-runtime.js";

export { codeUpdaterEndpoint, elementUpdater };

export const quickStyle = () => {
  const runtimePlugin = tailwindRuntime();

  return {
    name: "vite-plugin-quick-style",
    config() {
      return {
        optimizeDeps: { exclude: ["quick-style-hackathon"] },
        resolve: { preserveSymlinks: true },
      };
    },
    configureServer(server) {
      if (runtimePlugin && typeof runtimePlugin.configureServer === "function") {
        runtimePlugin.configureServer(server);
      }

      codeUpdaterEndpoint(server);
      elementUpdater(server);
      deleteUpdater(server)
    },
  };
};
