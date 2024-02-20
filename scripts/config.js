// postinstall.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, "template.genopti.config.js");
const targetPath = path.join(process.cwd(), "genopti.config.js"); // Target file in the user's project root

console.log("templatePath", templatePath);
console.log("targetPath", targetPath);

fs.copyFileSync(templatePath, targetPath);
console.log("Template config file has been copied to your project root.");
