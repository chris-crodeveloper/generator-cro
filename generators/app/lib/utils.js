/**
 * Utilities Module
 * Core utility functions for the CRO generator
 * @module utils
 */

import os from "os";
import path from "path";

/**
 * Custom error for utility operations
 */
class UtilityError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'UtilityError';
    this.code = code;
  }
}

/**
 * Gets custom templates from the specified directory
 * @param {Object} context - Yeoman context
 * @param {Object} fs - File system module
 * @returns {Array<string>|null} Array of template names or null
 * @throws {UtilityError} If template directory is invalid
 */
export const getCustomTemplates = (context, fs) => {
  try {
    const config = context.config.get("croconfig");
    if (!config?.templates?.customDirectory) {
      throw new UtilityError('Invalid template configuration', 'INVALID_TEMPLATE_CONFIG');
    }

    const templateDir = path.join(context.contextRoot, config.templates.customDirectory);
    
    if (!fs.existsSync(templateDir)) {
      return null;
    }

    const templates = fs.readdirSync(templateDir)
      .filter(folder => fs.statSync(path.join(templateDir, folder)).isDirectory());

    return templates.length ? ['default', ...templates] : null;
  } catch (error) {
    if (error instanceof UtilityError) throw error;
    throw new UtilityError(`Template directory error: ${error.message}`, 'TEMPLATE_DIR_ERROR');
  }
};

/**
 * Sets up file path variables based on platform
 * @private
 * @param {string} contextRoot - Root context path
 * @returns {Object} Path configuration object
 */
const setupPathConfig = (contextRoot) => {
  const prefix = os.platform() === 'win32' ? 'C:/' : 'file:///';
  return {
    prefix,
    normalize: (p) => p.replace(/\\/g, '/')
  };
};

/**
 * Generates file paths for template variables
 * @private
 * @param {Object} params - Path generation parameters
 * @returns {Object} Generated file paths
 */
const generateFilePaths = ({ config, answers, pathConfig, contextRoot }) => {
  const { childFolder, testId } = answers;
  const childPath = childFolder ? `${childFolder}/` : '';
  const basePath = `${config.output.destination}/${childPath}${testId}`;

  return {
    dir: `${pathConfig.prefix}${contextRoot}/${basePath}/dist`,
    server: `${config.output.localhost}/${basePath}/dist`,
    destination: `${contextRoot}/${basePath}/src`
  };
};

/**
 * Sets up template variables
 * @param {Object} context - Yeoman context
 * @throws {UtilityError} If template setup fails
 */
export const setupTemplateVariables = (context) => {
  try {
    const config = context.config.get("croconfig");
    if (!config) {
      throw new UtilityError('Configuration not found', 'CONFIG_NOT_FOUND');
    }

    const pathConfig = setupPathConfig(context.contextRoot);
    const paths = generateFilePaths({
      config,
      answers: context.answers,
      pathConfig,
      contextRoot: context.contextRoot
    });

    // Initialize template variables
    context.templateVariables = {
      destinationPath: paths.destination,
      ...generateFileVariables(config.prompts.files, paths),
      ...generateTestVariables(context.answers),
      optimizely: {}
    };

    // Setup Optimizely variables if needed
    if (shouldSetupOptimizely(context.answers)) {
      setupOptimizelyVariables(context, config);
    }
  } catch (error) {
    throw new UtilityError(`Template setup failed: ${error.message}`, 'TEMPLATE_SETUP_ERROR');
  }
};

/**
 * Sets up Optimizely template variables from API response
 * @param {Object} context - Yeoman context
 * @param {Object} response - Optimizely API response
 * @throws {UtilityError} If Optimizely setup fails
 */
export const setupOptimizelyTemplateVariables = (context, response) => {
  try {
    if (!response?.id || !response?.variations) {
      throw new UtilityError('Invalid Optimizely response', 'INVALID_OPTIMIZELY_RESPONSE');
    }

    context.templateVariables.optimizely = {
      ...context.templateVariables.optimizely,
      experimentId: response.id
    };

    context.templateVariables.testName = response.name;
    context.templateVariables.variationCount = response.variations.length - 1;
    context.templateVariables.variationData = response.variations.map(variation => ({
      variationName: variation.name,
      variationId: variation.variation_id
    }));
  } catch (error) {
    throw new UtilityError(`Optimizely template setup failed: ${error.message}`, 'OPTIMIZELY_SETUP_ERROR');
  }
};

/**
 * Creates a file from template
 * @param {Object} context - Yeoman context
 * @param {string} templatePath - Source template path
 * @param {string} destinationPath - Destination path
 * @throws {UtilityError} If file creation fails
 */
export const createFile = (context, templatePath, destinationPath) => {
  try {
    const normalizedTemplatePath = templatePath.replace(/\\/g, '/');
    const normalizedDestPath = destinationPath.replace(/\\/g, '/');

    context.fs.copyTpl(
      context.templatePath(normalizedTemplatePath),
      context.destinationPath(normalizedDestPath),
      context.templateVariables
    );
  } catch (error) {
    throw new UtilityError(`File creation failed: ${error.message}`, 'FILE_CREATE_ERROR');
  }
};

/**
 * Creates a variables file
 * @param {Object} context - Yeoman context
 * @param {string} templatePath - Source template path
 * @param {string} destinationPath - Destination path
 * @throws {UtilityError} If file creation fails
 */
export const createVariablesFile = (context, templatePath, destinationPath) => {
  try {
    const normalizedTemplatePath = templatePath.replace(/\\/g, '/');
    const normalizedDestPath = destinationPath.replace(/\\/g, '/');

    context.fs.copyTpl(
      context.templatePath(normalizedTemplatePath),
      context.destinationPath(normalizedDestPath),
      { templateVariables: context.templateVariables }
    );
  } catch (error) {
    throw new UtilityError(`Variables file creation failed: ${error.message}`, 'VARS_FILE_ERROR');
  }
};

/**
 * Gets formatted current date
 * @returns {string} Formatted date string (DD/MM/YYYY)
 */
export const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};

/**
 * Formats test name according to configuration
 * @param {Object} context - Yeoman context
 * @param {string} testName - Raw test name
 * @returns {string} Formatted test name
 */
export const getTestFormattedName = (context, testName) => {
  try {
    const config = context.config.get("croconfig");
    if (!config?.optimizely?.testNameFormat) {
      return testName;
    }

    return replaceTemplateVariables(
      config.optimizely.testNameFormat,
      context.templateVariables
    );
  } catch (error) {
    throw new UtilityError(`Test name formatting failed: ${error.message}`, 'NAME_FORMAT_ERROR');
  }
};

/**
 * Replaces template variables in a string
 * @private
 * @param {string} template - Template string
 * @param {Object} variables - Variables to replace
 * @returns {string} Processed string
 */
const replaceTemplateVariables = (template, variables) => {
  const regex = /<%=\s*(.*?)\s*%>/g;
  return template.replace(regex, (match, path) => {
    const value = path.trim().split('.')
      .reduce((obj, key) => obj?.[key], variables);
    return value ?? match;
  });
};

/**
 * Checks if Optimizely setup is needed
 * @private
 * @param {Object} answers - User answers
 * @returns {boolean} Whether Optimizely setup is needed
 */
const shouldSetupOptimizely = (answers) => {
  return answers.createOptimizelyTest?.includes('Existing') ||
         answers.createOptimizelyTest?.includes('New');
};

/**
 * Generates file variables
 * @private
 * @param {Object} files - File configuration
 * @param {Object} paths - Path configuration
 * @returns {Object} Generated file variables
 */
const generateFileVariables = (files, paths) => {
  const fileVariables = {};

  Object.entries(files).forEach(([key, file]) => {
    const extension = file.fileExtension || key;
    if (['shared', 'control', 'variation'].includes(extension)) return;

    fileVariables[key] = {
      shared: `${paths.dir}/${key}/shared.${extension}`,
      control: `${paths.dir}/${key}/control.${extension}`,
      variation: `${paths.dir}/${key}/`,
      server: {
        shared: `${paths.server}/${key}/shared.${key}`,
        control: `${paths.server}/${key}/control.${key}`,
        variation: `${paths.server}/${key}/`
      }
    };
  });

  return fileVariables;
};

/**
 * Generates test variables from answers
 * @private
 * @param {Object} answers - User answers
 * @returns {Object} Generated test variables
 */
const generateTestVariables = (answers) => ({
  testDetails: answers.testDetails || '',
  testId: answers.testId || '',
  testName: answers.testName || '',
  testUrl: answers.testUrl || '',
  testDescription: answers.testDescription || '',
  variationCount: answers.variations || '',
  childFolder: answers.childFolder || '',
  filesToGenerate: answers.filesToGenerate || '',
  developer: answers.developer || '',
  customTemplate: answers.customTemplate || ''
});