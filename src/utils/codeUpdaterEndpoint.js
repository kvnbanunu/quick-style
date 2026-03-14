import fs from "fs";
import path from "path";

export function codeUpdaterEndpoint(server) {
  server.middlewares.use((req, res, next) => {
    if (req.url === "/api/update-element" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => (body += chunk.toString()));
      req.on("end", () => {
        try {
          const { classes, filePath, line_number, column_number } = JSON.parse(body);

          console.log("Tailwind classes:", classes);
          console.log("File path:", filePath);
          console.log("Line number:", line_number);
          console.log("Column number:", column_number);
          
          const resolvedPath = path.resolve(filePath);
          const lines = fs.readFileSync(resolvedPath, "utf-8").split("\n");

          let line = lines[line_number - 1];
          const colI = column_number -1;

          const start = line.lastIndexOf("<", colI);
          const end = line.indexOf(">", start);
          const tag = line.slice(start, end + 1);

          let updatedTag;
          if (/className=/.test(tag)) {
            updatedTag = tag.replace(
              /className=".*?"/,
              `className="${classes.join(" ")}"`
            );
          } else {
            updatedTag = tag.replace(
              /<(\w+)/,
              `<$1 className="${classes.join(" ")}"`
            );
          }

          const updatedLine =
            line.slice(0, start) +
            updatedTag +
            line.slice(end + 1);

          lines[line_number - 1] = updatedLine;

          fs.writeFileSync(resolvedPath, lines.join("\n"), "utf-8");

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, targetLine: updatedLine }));
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
}