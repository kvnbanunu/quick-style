import fs from "fs";
import path from "path";

export function elementUpdater(server) {
  server.middlewares.use((req, res, next) => {
    if (req.url === "/api/update-full-element" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => {
        try {
          const { elementString, filePath, line_number, column_number } = JSON.parse(body);
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
            throw new Error("Invalid Tag: Could not find a valid opening tag at the calculated position.");
          }
          const tagName = tagMatch[1];
          console.log(`Detected Tag: <${tagName}>`);
          let lengthToReplace = 0;
          const openingTagEndIndex = remainingContent.indexOf(">") + 1;
          const openingTagContent = remainingContent.slice(0, openingTagEndIndex);

          if (openingTagContent.endsWith("/>")) {
            console.log("Mode: Self-closing tag detected.");
            lengthToReplace = openingTagEndIndex;
          } else {
            console.log(`Mode: Standard tag. Scanning for balanced </${tagName}>...`);
            
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
                lengthToReplace = match.index + fullMatch.length;
                break;
              }
            }

            if (lengthToReplace === 0) {
              lengthToReplace = openingTagEndIndex;
            }
          }

          let safeElementString = elementString.replace(/ class=/g, ' className=');
          safeElementString = safeElementString.replace(/ onclick=/g, ' onClick=');

          const normalizeHandlerBody = (handlerBody) => {
            const normalized = handlerBody
              .replace(/&quot;/g, '"')
              .replace(/\\"/g, '"')
              .trim();

            return /;\s*$/.test(normalized) ? normalized : `${normalized};`;
          };

          safeElementString = safeElementString.replace(
            /\sonClick\s*=\s*"((?:\\.|[^"\\])*)"/g,
            (_, handlerBody) => ` onClick={() => { ${normalizeHandlerBody(handlerBody)}}}`,
          );
          safeElementString = safeElementString.replace(
            /\sonClick\s*=\s*'((?:\\.|[^'\\])*)'/g,
            (_, handlerBody) => ` onClick={() => { ${normalizeHandlerBody(handlerBody)}}}`,
          );

          safeElementString = safeElementString.replace(/(?<!=)>(?!\n)/g, '>\n');
          safeElementString = safeElementString.replace(/&quot;/g, '"');

          const newFileContent = 
            fileContent.slice(0, startIndex) + 
            safeElementString +                   
            fileContent.slice(startIndex + lengthToReplace); 

          // console.log("String: " + safeElementString)

          fs.writeFileSync(resolvedPath, newFileContent, "utf-8");                

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }
    next();
  });
}