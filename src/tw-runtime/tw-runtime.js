// Tailwind won't render classes that aren't already included on the page
// This plugin will add that class to a stored list to be rendered

import fs from "fs";
import path from "path";

// this receives a new tailwind class and appends it to tw-runtime.txt
export default function tailwindRuntime() {
  const runtimeFile = path.resolve("src/tw-runtime/tw-runtime.txt");

  function clearFile() {
    fs.writeFileSync(runtimeFile, "");
  }

  return {
    name: "tailwind-runtime",

    configureServer(server) {
      clearFile();

      server.ws.on("tw:class", (cls) => {
        fs.appendFileSync(runtimeFile, cls + "\n");
      });

      process.on("SIGINT", () => {
        clearFile();
        process.exit();
      });
      process.on("SIGTERM", () => {
        clearFile();
        process.exit();
      });
    },
  };
}

// send new class to tw-runtime
export function sendClass(cls) {
  if (import.meta.hot) {
    import.meta.hot.send("tw:class", cls);
  }
}
