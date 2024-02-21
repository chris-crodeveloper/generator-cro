// postinstall.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function findProjectRoot(currentPath) {
  // Check if package.json exists in the current directory
  if (fs.existsSync(path.join(currentPath, "package.json"))) {
    return currentPath; // Found the project root
  }

  // If not found, move up one directory
  const parentDir = path.resolve(currentPath, "..");

  // If we've reached the root directory, return null (or throw an error, depending on your preference)
  if (parentDir === currentPath) {
    return null;
  }

  // Recursively search in the parent directory
  return findProjectRoot(parentDir);
}

const projectRoot = findProjectRoot(process.cwd());

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, "template.genopti.config.js");
const targetPath = path.join(projectRoot, "genopti.config.js"); // Target file in the user's project root

fs.copyFileSync(templatePath, targetPath);
console.log("Template config file has been copied to your project root.");
