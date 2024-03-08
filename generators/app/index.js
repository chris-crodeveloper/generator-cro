import Generator from "yeoman-generator";
import chalk from "chalk";
import {
  setupTemplateVariables,
  setupOptimizelyTemplateVariables,
  createFile,
  createVariablesFile,
  getFormattedDate,
  getTestFormattedName
} from "./lib/utils.js";

// Local imports
import { getPrompts } from "./lib/prompts.js";
import {
  fetchOptimizelyExperiment,
  createOptimizelyExperiment,
  optimizelyPayload,
} from "./lib/optimizely.js";
import { validateConfigFile } from "./lib/configValidation.js";
import path from "path";
import url from "url";

const loadConfig = async () => {
  const configPath = path.resolve(process.cwd(), "genopti.config.js"); // Resolve path to the user's root directory

  try {
    const configModule = await import(url.pathToFileURL(configPath));
    return configModule.default || configModule; // If the module has a default export, use it; otherwise, use the entire module
  } catch (err) {
    console.error("Error loading config file:", err);
    return {}; // Return empty object or handle error as needed
  }
};
let opticonfig;
let prompts;
export default class extends Generator {
  async initializing() {
    // Setup local config
    opticonfig = this.options.updatedMockConfig || (await loadConfig());

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

   
  }

  // Prompt answers
  async prompting() {
    this.answers = await this.prompt(prompts);

    // Setup the template variables
    setupTemplateVariables(this, opticonfig);
  }

  async writing() {
    try{
      // Set date
      this.templateVariables.date = getFormattedDate();

      // Prompt answers
      const templateVariables = this.templateVariables;
      const filesToGenerate = templateVariables.filesToGenerate;
      const files = opticonfig.prompts.files;

      // Get Optimizely Data
      if (opticonfig.optimizely?.projects?.length && (this.answers.createOptimizelyTest.includes("Existing") || this.answers.createOptimizelyTest.includes("New"))) {
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
          // Get formatted test name
          const testName = getTestFormattedName(this, this.templateVariables.testName);

          // Create the Optimizely request payload
          const payload = optimizelyPayload({
            noOfVariations: parseInt(this.templateVariables.variationCount),
            description: this.templateVariables.testDescription,
            testName: testName,
            projectId: optimizelyProject.project_id,
            testType: this.templateVariables.optimizely.testType,
            testUrl: this.templateVariables.testUrl,
            audiences: optimizelyProject.audiences,
          });


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


        // Update template variables
        setupOptimizelyTemplateVariables(this, response);
      }

      // Template path - custom or default
      // Set custom template
      const customTemplate = this.answers.useDefaultCustomTemplate ? opticonfig.templates.defaultCustomTemplate : this.answers.customTemplate;
      const templatePath = customTemplate && customTemplate !== "default"
          ? `${this.contextRoot}\\${opticonfig.templates.customDirectory}\\${customTemplate}`
          : "./default";

      // Create Files
      // Variation Files
      filesToGenerate.forEach((file) => {
        try {
          this.templateVariables.variations = {}
          this.templateVariables.variations.currentVariation = {};
          let extension = files[file].fileExtension
            ? files[file].fileExtension
            : file;

          // ignore generic file extensions
          if (["shared", "control", "variation"].includes(file)) return;

          // Create single files (in src dir)
          if (files[file]?.singleFile) {
            // Create variables file
            if(file === "variables"){
              createVariablesFile(
                this,
                `${templatePath}\\src\\${file}.${extension}`,
                `${templateVariables.destinationPath}\\${file}.${extension}`
              );
            } else {
              // uppercase readme
              if (file === "readme") file = "README";``
              createFile(
                this,
                `${templatePath}\\src\\${file}.${extension}`,
                `${templateVariables.destinationPath}\\${file}.${extension}`
              );
            }
          } else {
            // Create control
            if (filesToGenerate.includes("control")) {
              this.templateVariables.variations.control = {};
              this.templateVariables.variations.control.id = this
                .templateVariables?.variationData?.length
                ? this.templateVariables?.variationData[0]?.variationId
                : ``;
              this.templateVariables.variations.control.name = this
                .templateVariables?.variationData?.length
                ? this.templateVariables?.variationData[0]?.variationName
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
                i < parseInt(this.templateVariables.variationCount) + 1;
                i++
              ) {
                this.templateVariables.variations.currentVariation.index = i;
                this.templateVariables.variations.currentVariation.name = this
                  .templateVariables?.variationData?.length
                  ? this.templateVariables?.variationData[i]?.variationName
                  : `Variation #${i}`;
                this.templateVariables.variations.currentVariation.filename = `variation-${i}`;
                this.templateVariables.variations.currentVariation.id = this
                  .templateVariables?.variationData?.length
                  ? this.templateVariables?.variationData[i]?.variationId
                  : ``;

                createFile(
                  this,
                  `${templatePath}\\src\\${file}\\variation-x.${extension}`,
                  `${templateVariables.destinationPath}\\${file}\\${this.templateVariables.variations.currentVariation.filename}.${extension}`
                );
              }
            }
          }
        } catch (error) {
          this.log(chalk.red("Error Generating Files:" + error));
        }
      });
    } catch (error) {
      this.log(chalk.red("Error:" + error));
    }
  }
}
