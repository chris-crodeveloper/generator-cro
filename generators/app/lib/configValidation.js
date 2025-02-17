/**
 * Configuration validation module for CRO generator
 * Validates the configuration file structure and required fields
 * @module configValidation
 */

/**
 * Validation result interface
 * @typedef {Object} ValidationResult
 * @property {string[]} errors - Array of error messages
 * @property {string[]} warnings - Array of warning messages
 */

/**
 * Configuration validation error
 */
class ConfigValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

/**
 * Validates the presence and structure of required config sections
 * @param {Object} config - The configuration object to validate
 * @returns {string[]} Array of validation errors
 */
const validateRequiredSections = (config) => {
  const errors = [];
  const requiredSections = ['output', 'optimizely', 'templates', 'prompts'];

  requiredSections.forEach(section => {
    if (!config[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  });

  return errors;
};

/**
 * Validates the output configuration section
 * @param {Object} output - The output configuration section
 * @returns {string[]} Array of validation errors
 */
const validateOutputConfig = (output) => {
  const errors = [];

  if (!output.destination) {
    errors.push('No output destination set in configuration');
  } else if (typeof output.destination !== 'string') {
    errors.push('Output destination must be a string');
  }

  return errors;
};

/**
 * Validates Optimizely project configuration
 * @param {Object} project - The Optimizely project configuration
 * @returns {Object} Object containing warnings for missing optional fields
 */
const validateOptimizelyProject = (project) => {
  const warnings = [];

  console.log('project', project)

  if (!project.project_id) {
    warnings.push('No Optimizely project ID set - add one to utilize the API');
  }

  if (!project.auth_token) {
    warnings.push('No Optimizely auth token set - add one to utilize the API');
  }

  if (!project.audiences) {
    warnings.push('No Optimizely audiences configured - this may limit targeting options');
  }

  return warnings;
};

/**
 * Validates the templates configuration section
 * @param {Object} templates - The templates configuration section
 * @returns {string[]} Array of validation errors
 */
const validateTemplatesConfig = (templates) => {
  const errors = [];

  if (!templates.customDirectory) {
    errors.push('No custom templates directory specified');
  }

  return errors;
};

/**
 * Validates the prompts configuration section
 * @param {Object} prompts - The prompts configuration section
 * @returns {string[]} Array of validation errors
 */
const validatePromptsConfig = (prompts) => {
  const errors = [];

  if (!prompts.files || typeof prompts.files !== 'object') {
    errors.push('Invalid or missing files configuration in prompts section');
  }

  return errors;
};

/**
 * Validates the complete configuration file
 * @param {Object} config - The complete configuration object
 * @returns {ValidationResult} Validation result containing errors and warnings
 * @throws {ConfigValidationError} If the config object is invalid or missing
 */
export const validateConfigFile = (config) => {
  try {
    // Check if config is valid
    if (!config || typeof config !== 'object') {
      throw new ConfigValidationError('Invalid configuration object provided');
    }

    const validation = {
      errors: [],
      warnings: []
    };

    // Validate required sections
    validation.errors.push(...validateRequiredSections(config));

    // If required sections are missing, return early
    if (validation.errors.length > 0) {
      return validation;
    }

    // Validate output configuration
    validation.errors.push(...validateOutputConfig(config.output));

    // Validate templates configuration
    validation.errors.push(...validateTemplatesConfig(config.templates));

    // Validate prompts configuration
    validation.errors.push(...validatePromptsConfig(config.prompts));

    // Validate Optimizely configuration
    if (config.optimizely?.projects) {
      const defaultProject = config.optimizely.projects.find(
        project => project.default
      );

      if (!defaultProject) {
        validation.warnings.push('No default Optimizely project set - add one to utilize the API');
      } else {
        validation.warnings.push(...validateOptimizelyProject(defaultProject));
      }

      // Validate project array structure
      if (!Array.isArray(config.optimizely.projects)) {
        validation.errors.push('Optimizely projects must be an array');
      }
    }

    // Remove any empty strings or undefined values
    validation.errors = validation.errors.filter(Boolean);
    validation.warnings = validation.warnings.filter(Boolean);

    return validation;

  } catch (error) {
    if (error instanceof ConfigValidationError) {
      return {
        errors: [error.message],
        warnings: []
      };
    }

    // Log unexpected errors but return a user-friendly message
    console.error('Configuration validation error:', error);
    return {
      errors: ['An unexpected error occurred while validating configuration'],
      warnings: []
    };
  }
};

/**
 * Helper function to check if the configuration is valid
 * @param {Object} config - The configuration object to validate
 * @returns {boolean} True if the configuration is valid
 */
export const isConfigValid = (config) => {
  const validation = validateConfigFile(config);
  return validation.errors.length === 0;
};