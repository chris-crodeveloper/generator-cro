// postinstall.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Copy dirs
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  } else {
    console.log(`Project ${projectPath} already exists`);
  }

  const items = fs.readdirSync(src);

  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

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

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const destinationDir = '_templates'
const sourceDir = path.join(__dirname, './templates');
copyDirectory(sourceDir, destinationDir);

let folderCount = 0;
const projectRoot = findProjectRoot(process.cwd());

// Check if config already exists - if it does then don't do another
if (!fs.existsSync(path.join(projectRoot, "cro.config.js"))){

  

  const templatePath = path.join(__dirname, "template.cro.config.js");
  const targetPath = path.join(projectRoot, "cro.config.js"); // Target file in the user's project root

  fs.copyFileSync(templatePath, targetPath);
  console.log("Template config file has been copied to your project root.");
}


// Add templates
