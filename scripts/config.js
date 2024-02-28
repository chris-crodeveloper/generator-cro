// postinstall.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function findProjectRoot(currentPath) {
  // Move up on directory
  const parentDir = path.resolve(currentPath, "..");

  // Check if package.json exists in the current directory
  if (fs.existsSync(path.join(parentDir, "package.json"))) {
    return parentDir; // Found the project root
  }

  folderCount++;

  if (folderCount > 3) return null;

  // Recursively search in the parent directory
  return findProjectRoot(parentDir);
}

let folderCount = 0;
const projectRoot = findProjectRoot(process.cwd());

// Check if config already exists - if it does then don't do another
if (!fs.existsSync(path.join(projectRoot, "genopti.config.js"))){

  const __filename = fileURLToPath(import.meta.url);

  const __dirname = path.dirname(__filename);

  const templatePath = path.join(__dirname, "template.genopti.config.js");
  const targetPath = path.join(projectRoot, "genopti.config.js"); // Target file in the user's project root

  fs.copyFileSync(templatePath, targetPath);
  console.log("Template config file has been copied to your project root.");
}