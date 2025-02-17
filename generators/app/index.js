import Generator from "yeoman-generator";
import chalk from "chalk";
import path from "path";
import url from "url";

import {
  setupTemplateVariables,
  setupOptimizelyTemplateVariables,
  createFile,
  createVariablesFile,
  getFormattedDate,
  getTestFormattedName
} from "./lib/utils.js";

import { getPrompts } from "./lib/prompts.js";
import {
  fetchOptimizelyExperiment,
  createOptimizelyExperiment,
  optimizelyPayload,
} from "./lib/optimizely.js";
import { validateConfigFile } from "./lib/configValidation.js";

// Custom error class for generator-specific errors
class GeneratorError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'GeneratorError';
    this.code = code;
  }
}

/**
 * Loads and validates the configuration file
 * @returns {Promise<Object>} The configuration object
 * @throws {GeneratorError} If config file is invalid or missing
 */
const loadConfig = async () => {
  const configPath = path.resolve(process.cwd(), "cro.config.js");

  try {
    const configModule = await import(url.pathToFileURL(configPath));
    const config = configModule.default || configModule;
    
    if (!config) {
      throw new GeneratorError("Invalid configuration file structure", "INVALID_CONFIG");
    }
    
    return config;
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      throw new GeneratorError("Configuration file not found", "CONFIG_NOT_FOUND");
    }
    throw new GeneratorError(`Error loading configuration: ${error.message}`, "CONFIG_LOAD_ERROR");
  }
};

/**
 * Main Generator Class
 */
export default class CROGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.configData = null;
    this.templateVariables = {};
  }

  /**
   * Initialize the generator
   */
  async initializing() {
    try {
      // Load and validate configuration
      this.configData = this.options.updatedMockConfig || await loadConfig();
      
      // Validate config
      const validation = validateConfigFile(this.configData);
      this._handleValidation(validation);

      // Set up configuration
      this.config.set("croconfig", this.configData);
      this.config.save();

      // Initialize prompts
      this.prompts = getPrompts(this);
    } catch (error) {
      this._handleError(error, 'Initialization failed');
    }
  }

  /**
   * Handle user prompts
   */
  async prompting() {
    try {
      this.answers = await this.prompt(this.prompts);
      setupTemplateVariables(this, this.configData);
    } catch (error) {
      this._handleError(error, 'Prompting failed');
    }
  }

  /**
   * Generate files based on templates
   */
  async writing() {
    try {
      await this._setupTemplateData();
      
      if (this.configData.optimizely?.projects?.length) {
        await this._handleOptimizelyIntegration();
      }

      await this._generateFiles();
    } catch (error) {
      this._handleError(error, 'File generation failed');
    }
  }

  /**
   * Set up template data and variables
   */
  async _setupTemplateData() {
    this.templateVariables.date = getFormattedDate();
  }

  /**
   * Handle Optimizely integration
   */
  async _handleOptimizelyIntegration() {
    if (!this.answers.createOptimizelyTest.includes("Existing") && 
        !this.answers.createOptimizelyTest.includes("New")) {
      return;
    }

    const project = this._getOptimizelyProject();
    const response = await this._processOptimizelyRequest(project);
    setupOptimizelyTemplateVariables(this, response);
  }

  /**
   * Get Optimizely project configuration
   */
  _getOptimizelyProject() {
    return this.configData.optimizely.projects.find(
      project => project.project_name === this.templateVariables.optimizely.project_name
    );
  }

  /**
   * Process Optimizely API request
   */
  async _processOptimizelyRequest(project) {
    if (this.templateVariables.optimizely.requestType === "POST") {
      return this._createNewOptimizelyTest(project);
    }
    
    if (this.templateVariables.optimizely.requestType === "GET") {
      return this._fetchExistingOptimizelyTest(project);
    }
  }

  /**
   * Create new Optimizely test
   */
  async _createNewOptimizelyTest(project) {
    if (this.options.updatedMockConfig) return null;

    const testName = getTestFormattedName(this, this.templateVariables.testName);
    const payload = optimizelyPayload({
      noOfVariations: parseInt(this.templateVariables.variationCount),
      description: this.templateVariables.testDescription,
      testName,
      projectId: project.project_id,
      testType: this.templateVariables.optimizely.testType,
      testUrl: this.templateVariables.testUrl,
      audiences: project.audiences,
    });

    const response = await createOptimizelyExperiment(project.auth_token, payload);
    
    if (response?.campaign_id) {
      this.log(chalk.green(`SUCCESS - Optimizely Test: ${response.name}`));
    } else {
      throw new GeneratorError("Failed to create Optimizely test", "OPTIMIZELY_CREATE_ERROR");
    }

    return response;
  }

  /**
   * Fetch existing Optimizely test
   */
  async _fetchExistingOptimizelyTest(project) {
    if (this.options.updatedMockConfig) return null;

    return await fetchOptimizelyExperiment(
      this.templateVariables.optimizely.experimentId,
      project.auth_token
    );
  }

  /**
   * Generate files based on configuration
   */
  async _generateFiles() {
    const { filesToGenerate } = this.templateVariables;
    const files = this.configData.prompts.files;
    const templatePath = this._getTemplatePath();

    for (const file of filesToGenerate) {
      await this._generateFile(file, files, templatePath);
    }
  }

  /**
   * Get template path based on configuration
   */
  _getTemplatePath() {
    const customTemplate = this.answers.useDefaultCustomTemplate 
      ? this.configData.templates.defaultCustomTemplate 
      : this.answers.customTemplate;

    return customTemplate && customTemplate !== "default"
      ? path.join(this.contextRoot, this.configData.templates.customDirectory, customTemplate)
      : "./default";
  }

  /**
   * Generate individual file
   */
  async _generateFile(file, files, templatePath) {
    try {
      this.templateVariables.variations = {
        currentVariation: {}
      };

      const extension = files[file]?.fileExtension || file;

      if (["shared", "control", "variation"].includes(file)) return;

      if (files[file]?.singleFile) {
        await this._generateSingleFile(file, extension, templatePath);
      } else {
        await this._generateVariationFiles(file, extension, templatePath);
      }
    } catch (error) {
      this._handleError(error, `Failed to generate file: ${file}`);
    }
  }

  /**
   * Generate single file
   */
  async _generateSingleFile(file, extension, templatePath) {
    const filename = file === "readme" ? "README" : file;
    const sourcePath = path.join(templatePath, 'src', `${filename}.${extension}`);
    const destPath = path.join(this.templateVariables.destinationPath, `${filename}.${extension}`);

    if (file === "variables") {
      await createVariablesFile(this, sourcePath, destPath);
    } else {
      await createFile(this, sourcePath, destPath);
    }
  }

/**
   * Generate variation files
   */
async _generateVariationFiles(file, extension, templatePath) {
  const { filesToGenerate } = this.templateVariables;

  if (filesToGenerate.includes("control")) {
    await this._generateControlFile(file, extension, templatePath);
  }

  if (filesToGenerate.includes("shared")) {
    await this._generateSharedFile(file, extension, templatePath);
  }

  if (filesToGenerate.includes("variation")) {
    await this._generateVariations(file, extension, templatePath);
  }
}

 /**
   * Generate variations
   */
 async _generateVariations(file, extension, templatePath) {
  try {
    for (let i = 1; i < parseInt(this.templateVariables.variationCount) + 1; i++) {
      this.templateVariables.variations.currentVariation = {
        index: i,
        name: this.templateVariables?.variationData?.length
          ? this.templateVariables?.variationData[i]?.variationName
          : `Variation #${i}`,
        filename: `variation-${i}`,
        id: this.templateVariables?.variationData?.length
          ? this.templateVariables?.variationData[i]?.variationId
          : ''
      };

      await createFile(
        this,
        path.join(templatePath, 'src', file, 'variation-x.' + extension),
        path.join(this.templateVariables.destinationPath, file, this.templateVariables.variations.currentVariation.filename + '.' + extension)
      );
    }
  } catch (error) {
    this._handleError(error, `Failed to generate variations for ${file}`);
  }
}


  /**
   * Generate control file
   */
  async _generateControlFile(file, extension, templatePath) {
    try {
      this.templateVariables.variations.control = {
        id: this.templateVariables?.variationData?.length
          ? this.templateVariables?.variationData[0]?.variationId
          : '',
        name: this.templateVariables?.variationData?.length
          ? this.templateVariables?.variationData[0]?.variationName
          : ''
      };

      await createFile(
        this,
        path.join(templatePath, 'src', file, `control.${extension}`),
        path.join(this.templateVariables.destinationPath, file, `control.${extension}`)
      );
    } catch (error) {
      this._handleError(error, `Failed to generate control file for ${file}`);
    }
  }

    /**
   * Generate shared file
   */
    async _generateSharedFile(file, extension, templatePath) {
      try {
        await createFile(
          this,
          path.join(templatePath, 'src', file, `shared.${extension}`),
          path.join(this.templateVariables.destinationPath, file, `shared.${extension}`)
        );
      } catch (error) {
        this._handleError(error, `Failed to generate shared file for ${file}`);
      }
    }

  /**
   * Handle validation results
   */
  _handleValidation(validation) {
    if (validation.errors.length) {
      validation.errors.forEach(message => this.log(chalk.red(message)));
      throw new GeneratorError("Configuration validation failed", "VALIDATION_ERROR");
    }

    validation.warnings.forEach(message => this.log(chalk.yellow(message)));
  }

  /**
   * Handle errors
   */
  _handleError(error, context) {
    const message = error instanceof GeneratorError 
      ? error.message 
      : `${context}: ${error.message}`;
    
    this.log(chalk.red(message));
    throw error;
  }
}