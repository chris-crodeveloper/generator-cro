/**
 * NPM Install Script
 * Copies templates when package is installed via npm
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const Logger = {
  info: (message) => console.log(`\x1b[36mINFO:\x1b[0m ${message}`),
  success: (message) => console.log(`\x1b[32mSUCCESS:\x1b[0m ${message}`),
  error: (message) => console.log(`\x1b[31mERROR:\x1b[0m ${message}`),
  debug: (message) => console.log(`\x1b[35mDEBUG:\x1b[0m ${message}`)
};

async function install() {
  try {
    // Current script directory
    const currentFile = fileURLToPath(import.meta.url);
    const currentDir = dirname(currentFile);
    
    // Source is one level up from bin directory
    const sourceDir = path.dirname(currentDir);
    
    // Templates directory should be in the package root
    const templatesDir = path.join(sourceDir, 'templates');

    if (!fs.existsSync(templatesDir)) {
      Logger.error(`Templates directory not found at: ${templatesDir}`);
      return;
    }

    // Target directory should be where the user is installing the package
    const targetDir = process.cwd();

    Logger.info(`Current directory: ${currentDir}`);
    Logger.info(`Source directory: ${sourceDir}`);
    Logger.info(`Target directory: ${targetDir}`);

    // Copy templates
    const templatesDest = path.join(targetDir, '_templates');

    if (targetDir !== sourceDir) {
      if (!fs.existsSync(templatesDest)) {
        fs.mkdirSync(templatesDest, { recursive: true });
        fs.cpSync(templatesDir, templatesDest, { recursive: true });
        Logger.success('Templates installed successfully');
      } else {
        Logger.info('Templates directory already exists, skipping');
      }

      // Copy config file
      const configSource = path.join(sourceDir, 'template.cro.config.js');
      const configDest = path.join(targetDir, 'cro.config.js');

      if (!fs.existsSync(configDest) && fs.existsSync(configSource)) {
        fs.copyFileSync(configSource, configDest);
        Logger.success('Configuration file created');
      }
    } else {
      Logger.info('Running in package directory, skipping installation');
    }

  } catch (error) {
    Logger.error(`Installation error: ${error.message}`);
    console.error(error);
  }
}

// Run installation
install().catch(error => {
  Logger.error(`Unexpected error: ${error.message}`);
  console.error(error);
});