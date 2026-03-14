import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    {
    name: "quickstyle-backend",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/api/update-element" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => (body += chunk.toString()));
            req.on("end", () => {
              try {
                const { original, classes } = JSON.parse(body);
                console.log("Original element:", original);
                console.log("Tailwind classes:", classes);
                
                let file = "/Users/reecemelnick/Desktop/hack/quick-style/src/App.jsx";
                const filePath = path.resolve(file);

                let line_number = 13;

                const lines = fs.readFileSync(filePath, "utf-8").split("\n");
                let targetLine = lines[line_number - 1];

                if (/className=/.test(targetLine)) {
                  targetLine = targetLine.replace(
                    /className=".*?"/,
                    `className="${classes.join(" ")}"`
                  );
                } else {
                  targetLine = targetLine.replace(
                    /<(\w+)/,
                    `<$1 className="${classes.join(" ")}"`
                  );
                }

                lines[line_number - 1] = targetLine;

                fs.writeFileSync(filePath, lines.join("\n"), "utf-8");

                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true, targetLine: targetLine }));
              } catch (err) {
                console.error(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }
          next();
        });
      },
    },
  ],
});
