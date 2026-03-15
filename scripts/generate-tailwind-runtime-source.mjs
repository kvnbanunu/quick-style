import fs from "fs";
import path from "path";
import tailwindClasses from "../src/components/tailwindClasses.js";

const outputFile = path.resolve("src/tw-runtime/prebuilt-classes.txt");
const outputDir = path.dirname(outputFile);

fs.mkdirSync(outputDir, { recursive: true });

const unique = [...new Set((tailwindClasses || []).filter(Boolean))];
const content = unique.join("\n") + "\n";

fs.writeFileSync(outputFile, content, "utf-8");
console.log(`Generated ${unique.length} classes in ${outputFile}`);
