import Generator from "yeoman-generator";
import fs from "fs";
import chalk from "chalk";
import {
  getCustomTemplates,
  setupTemplateVariables,
  createFile,
  getFormattedDate,
} from "./lib/utils.js";

// Local imports
import { getPrompts } from "./lib/prompts.js";
import {
  fetchOptimizelyExperiment,
  createOptimizelyExperiment,
  optimizelyPayload,
} from "./lib/optimizely.js";
import config from "../../../genopti.config.js";
import { validateConfigFile } from "./lib/configValidation.js";

let opticonfig;
let prompts;
export default class extends Generator {
  async initializing() {
    // Setup local config
    opticonfig = this.options.updatedMockConfig || config;

    // Check if opticonfig config file exists
    if (!opticonfig) {
      this.log(chalk.red("ERROR: opti.config.js file not found"));
      return;
    }

    this.config.set("opticonfig", opticonfig);

    // Save generator config in root
    this.config.save();

    // Validate config
    const validation = validateConfigFile(opticonfig);

    // Errors
    if (validation.errors.length) {
      validation.errors.forEach((message) => {
        this.log(chalk.red(message));
      });
      return;
    }

    // Warnings
    if (validation.warnings.length) {
      validation.warnings.forEach((message) => {
        this.log(chalk.yellow(message));
      });
    }

    // Get prompts
    prompts = getPrompts(this);

    // Check for custom templates
    const customTemplates = getCustomTemplates(this, fs);

    // if custom templates exist then add the prompt to chose between templates
    if (customTemplates) {
      // Shift elements to the right starting from the end
      for (let i = prompts.length - 1; i > 1; i--) {
        prompts[i] = prompts[i - 1];
      }
      prompts[1] = {
        type: "list",
        name: "customTemplate",
        message: "Please select the templates you'd like to build:",
        default: customTemplates[0],
        choices: customTemplates,
      };
    }
  }

  // Prompt answers
  async prompting() {
    this.answers = await this.prompt(prompts);

    // Setup the template variables
    setupTemplateVariables(this, opticonfig);

    this.log(this.templateVariables);
  }

  writing() {
    this.log(this.answers);
    // Set date
    this.templateVariables.date = getFormattedDate();

    // Prompt answers
    const templateVariables = this.templateVariables;
    const filesToGenerate = templateVariables.filesToGenerate;
    const files = opticonfig.prompts.files;

    // Create Optimizely Test
    console.log(opticonfig.optimizely.project_defaults.auth_token);
    //if()

    // Get Optimizely Test

    // Template path - custom or default
    const templatePath =
      this.answers.customTemplate && this.answers.customTemplate !== "default"
        ? `${this.contextRoot}\\${opticonfig.templates.customDirectory}\\${this.answers.customTemplate}`
        : "./default";

    // Create Files
    // Variation Files
    filesToGenerate.forEach((file) => {
      try {
        let extension = files[file].fileExtension
          ? files[file].fileExtension
          : file;

        // ignore generic file extensions
        if (["shared", "control", "variation"].includes(file)) return;

        // Create single files (in src dir)
        if (files[file].singleFile) {
          // uppercase readme
          if (file === "readme") file = "README";
          createFile(
            this,
            `${templatePath}\\src\\${file}.${extension}`,
            `${templateVariables.destinationPath}\\${file}.${extension}`
          );
        } else {
          // Create control
          if (filesToGenerate.includes("control")) {
            createFile(
              this,
              `${templatePath}\\src\\${file}\\control.${extension}`,
              `${templateVariables.destinationPath}\\${file}\\control.${extension}`
            );
          }

          // Create shared
          if (filesToGenerate.includes("shared")) {
            createFile(
              this,
              `${templatePath}\\src\\${file}\\shared.${extension}`,
              `${templateVariables.destinationPath}\\${file}\\shared.${extension}`
            );
          }

          // Create variation
          if (filesToGenerate.includes("variation")) {
            for (
              let i = 1;
              i < parseInt(this.templateVariables.variations) + 1;
              i++
            ) {
              this.templateVariables.currentVariation = i;
              this.templateVariables.currentVariationName = `variation-${i}`;
              createFile(
                this,
                `${templatePath}\\src\\${file}\\variation-x.${extension}`,
                `${templateVariables.destinationPath}\\${file}\\${this.templateVariables.currentVariationName}.${extension}`
              );
            }
          }
        }
      } catch (error) {
        this.log(chalk.red("Error Generating Files:" + error));
      }
    });
  }
}
