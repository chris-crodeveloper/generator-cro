import Generator from "yeoman-generator";
import fs from "fs";
import chalk from "chalk";
import {
  getCustomTemplates,
  setupTemplateVariables,
  setupOptimizelyTemplateVariables,
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
      prompts.splice(1, 0, {
        type: "list",
        name: "customTemplate",
        message: "Please select the templates you'd like to build:",
        default: customTemplates[0],
        choices: customTemplates,
      });
    }
  }

  // Prompt answers
  async prompting() {
    this.answers = await this.prompt(prompts);

    // Setup the template variables
    setupTemplateVariables(this, opticonfig);
  }

  async writing() {
    // Set date
    this.templateVariables.date = getFormattedDate();

    // Prompt answers
    const templateVariables = this.templateVariables;
    const filesToGenerate = templateVariables.filesToGenerate;
    const files = opticonfig.prompts.files;

    // Get Optimizely Data
    if (this.templateVariables.optimizely) {
      let response;
      const optimizelyProject = opticonfig.optimizely.projects.find(
        (project) => {
          return (
            project.project_name ===
            this.templateVariables.optimizely.project_name
          );
        }
      );

      // Create a new Optimizely test
      if (this.templateVariables.optimizely.requestType === "POST") {
        // Create the Optimizely request payload
        const payload = optimizelyPayload({
          noOfVariations: parseInt(this.templateVariables.variations),
          description: this.templateVariables.testDescription,
          testName: this.templateVariables.testName,
          projectId: optimizelyProject.project_id,
          testType: this.templateVariables.optimizely.testType,
          testUrl: this.templateVariables.testUrl,
          audiences: optimizelyProject.audiences,
        });

        console.log("payload", payload);

        // create optimizely experiment
        if (!this.options.updatedMockConfig) {
          response = await createOptimizelyExperiment(
            optimizelyProject.auth_token,
            payload
          );
        }
      }

      // GET existing Optimizely Test
      if (this.templateVariables.optimizely.requestType === "GET") {
        if (!this.options.updatedMockConfig) {
          response = await fetchOptimizelyExperiment(
            this.templateVariables.optimizely.experimentId,
            optimizelyProject.auth_token
          );
        }
      }

      //

      console.log("response", response);

      // Update template variables
      setupOptimizelyTemplateVariables(this, response);
      //console.log(opticonfig.optimizely.defaults.auth_token);
      //if()
    }

    // Template path - custom or default
    const templatePath =
      this.answers.customTemplate && this.answers.customTemplate !== "default"
        ? `${this.contextRoot}\\${opticonfig.templates.customDirectory}\\${this.answers.customTemplate}`
        : "./default";

    // Create Files
    // Variation Files
    filesToGenerate.forEach((file) => {
      try {
        this.templateVariables.currentVariation = {};
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
            this.templateVariables.currentVariation.control = {};
            this.templateVariables.currentVariation.control.id = this
              .templateVariables?.variationData[0]
              ? this.templateVariables?.variationData[0].variationId
              : ``;
            this.templateVariables.currentVariation.control.name = this
              .templateVariables?.variationData[0]
              ? this.templateVariables?.variationData[0].variationName
              : ``;
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
              i < parseInt(this.templateVariables.variations);
              i++
            ) {
              this.templateVariables.currentVariation.index = i;
              this.templateVariables.currentVariation.name = this
                .templateVariables?.variationData[i]
                ? this.templateVariables?.variationData[i].variationName
                : `Variation #${i}`;
              this.templateVariables.currentVariation.filename = `variation-${i}`;
              this.templateVariables.currentVariation.id = this
                .templateVariables?.variationData[i]
                ? this.templateVariables?.variationData[i].variationId
                : ``;
              createFile(
                this,
                `${templatePath}\\src\\${file}\\variation-x.${extension}`,
                `${templateVariables.destinationPath}\\${file}\\${this.templateVariables.currentVariation.filename}.${extension}`
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
