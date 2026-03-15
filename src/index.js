import './index.css';

export { default as QuickStyle } from './components/QuickStyle.jsx';
import { codeUpdaterEndpoint } from "./utils/codeUpdaterEndpoint.js";
import { elementUpdater } from "./utils/elementUpdater.js";

export { codeUpdaterEndpoint, elementUpdater };

export const quickStyle = () => {
  return {
    name: "vite-plugin-quick-style",
    config() {
      return {
        optimizeDeps: { exclude: ["quick-style-hackathon"] },
        resolve: { preserveSymlinks: true },
      };
    },
    configureServer(server) {
      console.log("🚀 QuickStyle: API Bridge Active");
      codeUpdaterEndpoint(server);
      elementUpdater(server);
    },
  };
};
