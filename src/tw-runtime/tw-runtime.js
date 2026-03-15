// Tailwind won't render classes that aren't already included on the page
// This plugin will add that class to a stored list to be rendered

import fs from "fs";
import path from "path";

// this receives a new tailwind class and appends it to tw-runtime.txt
export default function tailwindRuntime() {
  const runtimeFile = path.resolve("src/tw-runtime/tw-runtime.txt");

  function ensureRuntimeFile() {
    fs.mkdirSync(path.dirname(runtimeFile), { recursive: true });
    if (!fs.existsSync(runtimeFile)) {
      fs.writeFileSync(runtimeFile, "", "utf-8");
    }
  }

  function clearFile() {
    ensureRuntimeFile();
    fs.writeFileSync(runtimeFile, "", "utf-8");
  }

  return {
    name: "tailwind-runtime",

    configureServer(server) {
      clearFile();

      server.ws.on("tw:class", (cls) => {
        const next = String(cls || "").trim();
        if (!next) return;

        ensureRuntimeFile();
        const existing = fs.readFileSync(runtimeFile, "utf-8");
        const hasClass = existing.split(/\r?\n/).includes(next);
        if (hasClass) return;

        fs.appendFileSync(runtimeFile, next + "\n", "utf-8");

        // Trigger a fresh page load so Tailwind picks up the updated runtime list.
        server.ws.send({ type: "full-reload" });
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

