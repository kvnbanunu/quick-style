import fs from "fs";
import path from "path";

export function deleteUpdater(server) {
  server.middlewares.use((req, res, next) => {
    if (req.url === "/api/delete-element" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => {
        try {
          const { filePath, line_number, column_number } = JSON.parse(body);
          const resolvedPath = path.resolve(filePath);

          const fileContent = fs.readFileSync(resolvedPath, "utf-8");
          const lines = fileContent.split("\n");
          
          let startIndex = 0;
          for (let i = 0; i < line_number - 1; i++) {
            startIndex += lines[i].length + 1;
          }
          startIndex += (column_number - 1);

          const remainingContent = fileContent.slice(startIndex);

          const tagMatch = remainingContent.match(/^<([a-zA-Z0-9-]+)/);
          if (!tagMatch) {
            throw new Error("Could not find a valid tag at this position.");
          }
          
          const tagName = tagMatch[1];
          let lengthToDelete = 0;
          const openingTagEndIndex = remainingContent.indexOf(">") + 1;
          const openingTagContent = remainingContent.slice(0, openingTagEndIndex);

          if (openingTagContent.endsWith("/>")) {
            lengthToDelete = openingTagEndIndex;
          } else {
            let stack = 0;
            const tagPattern = new RegExp(`(<${tagName}(\\s|/?>))|(</${tagName}>)`, "g");
            let match;
            
            while ((match = tagPattern.exec(remainingContent)) !== null) {
              const fullMatch = match[0];
              if (fullMatch.startsWith("</")) {
                stack--;
              } else if (!fullMatch.endsWith("/>")) {
                stack++;
              }

              if (stack === 0) {
                lengthToDelete = match.index + fullMatch.length;
                break;
              }
            }
          }

          if (lengthToDelete === 0) lengthToDelete = openingTagEndIndex;

          const newFileContent = 
            fileContent.slice(0, startIndex) + 
            fileContent.slice(startIndex + lengthToDelete); 

          fs.writeFileSync(resolvedPath, newFileContent, "utf-8");                

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, deletedTag: tagName }));
        } catch (err) {
          console.error("Delete Error:", err.message);
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }
    next();
  });
}