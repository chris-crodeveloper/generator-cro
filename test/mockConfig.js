/**
 * CRO Configuration Module
 * Defines the configuration schema and default values for the CRO generator
 * @module croConfig
 */

/**
 * File type configuration interface
 * @typedef {Object} FileTypeConfig
 * @property {boolean} showInPrompts - Whether to show in prompts
 * @property {boolean} checkedByDefault - Whether checked by default
 * @property {string} [fileExtension] - Optional file extension override
 * @property {boolean} [singleFile] - Whether this is a single file
 */

/**
 * Default file types configuration
 * @type {Object.<string, FileTypeConfig>}
 */
const DEFAULT_FILE_TYPES = {
  html: {
    showInPrompts: true,
    checkedByDefault: true
  },
  shared: {
    showInPrompts: true,
    checkedByDefault: true
  },
  control: {
    showInPrompts: true,
    checkedByDefault: true
  },
  variation: {
    showInPrompts: true,
    checkedByDefault: true
  },
  js: {
    showInPrompts: true,
    checkedByDefault: true
  },
  css: {
    showInPrompts: true,
    checkedByDefault: true
  },
  readme: {
    showInPrompts: true,
    checkedByDefault: true,
    fileExtension: "md",
    singleFile: true
  },
  scss: {
    showInPrompts: true,
    checkedByDefault: false
  },
  tampermonkey: {
    showInPrompts: true,
    checkedByDefault: false,
    fileExtension: "js"
  },
  cypress: {
    showInPrompts: true,
    checkedByDefault: false,
    singleFile: true,
    fileExtension: "js"
  }
};

/**
 * Default prompt configuration
 * @type {Object}
 */
const DEFAULT_PROMPT_CONFIG = {
  childFolders: ["testChildFolder"],
  developers: ["Chris", "Pushkal", "Josh"],
  homepageUrl: "https://www.optimizely.com/",
  testIdExample: "OPTI-1",
  testNameExample: "My First Optimizely Test"
};

/**
 * Optimizely project configuration interface
 * @typedef {Object} OptimizelyProject
 * @property {string} project_name - Project name
 * @property {string} auth_token - Authentication token
 * @property {number} project_id - Project ID
 * @property {Object.<string, number>} audiences - Audience configurations
 * @property {boolean} [default] - Whether this is the default project
 */

/**
 * Configuration schema
 * @type {Object}
 */
const configSchema = {
  /**
   * Optimizely configuration
   */
  optimizely: {
    testNameFormat: '[<%= testId %>][<%= optimizely.testType %>][<%= testName %>]',
    projects: [] /** @type {OptimizelyProject[]} */
  },

  /**
   * Input configuration
   */
  prompts: {
    config: DEFAULT_PROMPT_CONFIG,
    files: DEFAULT_FILE_TYPES
  },

  /**
   * Output configuration
   */
  output: {
    destination: "_tests",
    localhost: ""
  },

  /**
   * Template configuration
   */
  templates: {
    customDirectory: "../test_custom_templates",
    defaultCustomTemplate: ""
  }
};

/**
 * Creates a new configuration object with default values
 * @returns {Object} Default configuration object
 */
const createDefaultConfig = () => {
  return JSON.parse(JSON.stringify(configSchema));
};

/**
 * Merges user config with default config
 * @param {Object} userConfig - User provided configuration
 * @returns {Object} Merged configuration
 */
const mergeWithDefaultConfig = (userConfig) => {
  const defaultConfig = createDefaultConfig();
  return deepMerge(defaultConfig, userConfig);
};

/**
 * Deep merges two objects
 * @private
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
const deepMerge = (target, source) => {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key]) && isObject(target[key])) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
};

/**
 * Checks if value is an object
 * @private
 * @param {*} item - Value to check
 * @returns {boolean} Whether value is an object
 */
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Validates a configuration object
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result
 */
const validateConfig = (config) => {
  const errors = [];
  const warnings = [];

  // Required sections
  const requiredSections = ['optimizely', 'prompts', 'output', 'templates'];
  requiredSections.forEach(section => {
    if (!config[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  });

  // Output validation
  if (!config.output?.destination) {
    errors.push('Missing output destination');
  }

  // File type validation
  if (config.prompts?.files) {
    Object.entries(config.prompts.files).forEach(([key, value]) => {
      if (!value.showInPrompts) {
        warnings.push(`File type '${key}' is hidden from prompts`);
      }
    });
  }

  // Template validation
  if (!config.templates?.customDirectory) {
    warnings.push('No custom template directory specified');
  }

  return { errors, warnings };
};

/**
 * Export the base configuration
 * If importing from cro-web-development, this will be overwritten
 */
export default configSchema;

/**
 * Export utilities
 */
export const utils = {
  createDefaultConfig,
  mergeWithDefaultConfig,
  validateConfig
};