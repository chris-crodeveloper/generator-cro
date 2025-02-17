/**
 * Prompts Module
 * Handles user interaction and prompt configuration for the CRO generator
 * @module prompts
 */

import {
  isNotEmpty,
  optimizelyIdValidation,
  isNumber,
} from "./validationHelper.js";
import figlet from "figlet";
import chalk from "chalk";
import { TEST_TYPES } from "./optimizely.js";
import { getCustomTemplates } from "./utils.js";
import fs from "fs";

/**
 * Custom error for prompt-related issues
 */
class PromptError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'PromptError';
    this.code = code;
  }
}

/**
 * Generates ASCII art text using figlet
 * @async
 * @param {string} text - Text to convert
 * @returns {Promise<string>} ASCII art text
 */
const generateFigletText = async (text) => {
  try {
    return new Promise((resolve, reject) => {
      figlet.text(text, (error, data) => {
        if (error) {
          reject(new PromptError('Failed to generate ASCII art', 'FIGLET_ERROR'));
        } else {
          resolve(data);
        }
      });
    });
  } catch (error) {
    throw new PromptError(
      `ASCII art generation failed: ${error.message}`,
      'ASCII_GEN_ERROR'
    );
  }
};

/**
 * Converts camelCase to Title Case
 * @param {string} inputString - String to convert
 * @returns {string} Converted string
 */
const convertToTitleCase = (inputString) => {
  try {
    if (typeof inputString !== 'string') {
      throw new PromptError('Input must be a string', 'INVALID_INPUT');
    }

    return inputString
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();
  } catch (error) {
    throw new PromptError(
      `String conversion failed: ${error.message}`,
      'CONVERSION_ERROR'
    );
  }
};

/**
 * Generates file choices array from config
 * @param {Object} config - Configuration object
 * @returns {Array} Array of file choices
 */
const generateFileChoices = (config) => {
  try {
    if (!config?.prompts?.files) {
      throw new PromptError('Invalid config structure', 'INVALID_CONFIG');
    }

    return Object.entries(config.prompts.files)
      .filter(([_, file]) => file.showInPrompts)
      .map(([key, file]) => ({
        name: ` - ${key}`,
        value: key,
        checked: file.checkedByDefault
      }));
  } catch (error) {
    throw new PromptError(
      `File choice generation failed: ${error.message}`,
      'FILE_CHOICE_ERROR'
    );
  }
};

/**
 * Generates Optimizely-related prompts
 * @param {Object} config - Configuration object
 * @returns {Array} Array of Optimizely prompts
 */
const generateOptimizelyPrompts = (config, defaultProject) => {
  const baseChoices = ['Files - create local files only'];
  const optimizelyChoices = defaultProject?.auth_token && defaultProject?.project_id
    ? [
        'New - create new experiment in Optimizely',
        'Existing - request existing experiment from Optimizely',
        ...baseChoices
      ]
    : baseChoices;

  return [
    {
      type: 'list',
      name: 'createOptimizelyTest',
      message: async () => 'How would you like the files created?',
      choices: optimizelyChoices
    }
  ];
};

/**
 * Generates template selection prompts
 * @param {Object} params - Template parameters
 * @returns {Array} Array of template prompts
 */
const generateTemplatePrompts = ({ customTemplates, defaultTemplate, defaultExists }) => {
  const prompts = [];

  if (customTemplates && defaultExists) {
    prompts.push({
      type: 'confirm',
      name: 'useDefaultCustomTemplate',
      message: async () => `Continue with the ${chalk.green(defaultTemplate)} custom template?`
    });
  }

  if (customTemplates) {
    prompts.push({
      when: (responses) => !responses.useDefaultCustomTemplate || !defaultTemplate || !defaultExists,
      type: 'list',
      name: 'customTemplate',
      message: 'Please select the templates you\'d like to build:',
      default: customTemplates[0],
      choices: customTemplates
    });
  }

  return prompts;
};

/**
 * Gets all prompts for the generator
 * @param {Object} context - Generator context
 * @returns {Array} Array of prompts
 */
export const getPrompts = (context) => {
  try {
    const config = context.config.get("croconfig");
    if (!config) {
      throw new PromptError('Configuration not found', 'CONFIG_NOT_FOUND');
    }

    const defaultProject = config.optimizely.projects.find(project => project.default);
    const customTemplates = getCustomTemplates(context, fs);
    const defaultTemplate = config.templates.defaultCustomTemplate;
    const defaultExists = customTemplates?.includes(defaultTemplate);

    const prompts = [
      // Welcome prompt
      {
        type: 'input',
        name: 'testDetails',
        message: async () => {
          const welcome = await generateFigletText('Welcome!');
          return `${welcome}\n\nTo the CRO generator.\n\nPlease enter the URL to the test details (eg JIRA, Trello etc)`;
        },
        validate: isNotEmpty
      },

      // Template prompts
      ...generateTemplatePrompts({ customTemplates, defaultTemplate, defaultExists }),

      // Optimizely prompts
      ...generateOptimizelyPrompts(config, defaultProject),

      // Test configuration prompts
      {
        type: 'input',
        name: 'testId',
        message: async () => `Please enter the test ID (this is used to namespace the test - eg ${config.prompts.config.testIdExample}):`,
        validate: isNotEmpty
      },
      {
        when: (responses) => responses.createOptimizelyTest?.includes('New') || responses.createOptimizelyTest?.includes('Files'),
        type: 'input',
        name: 'testName',
        message: async () => `Please enter the test name - eg ${config.prompts.config.testNameExample}):`,
        validate: isNotEmpty
      },
      {
        type: 'input',
        name: 'testDescription',
        message: async () => 'Please enter the test description (optional):'
      },
      {
        when: (responses) => responses.createOptimizelyTest?.includes('New') || responses.createOptimizelyTest?.includes('Files'),
        type: 'input',
        name: 'variations',
        message: async () => 'Please enter the number of variations (not including control):',
        validate: isNumber
      },
      {
        type: 'input',
        name: 'testUrl',
        message: async () => 'Please enter the URL the test will run on:',
        default: config.prompts.config.homepageUrl,
        validate: isNotEmpty
      },

      // File generation prompts
      {
        type: 'checkbox',
        name: 'filesToGenerate',
        message: async () => 'Please select the files required to build locally:',
        choices: generateFileChoices(config)
      },

      // Developer selection
      {
        when: () => config.prompts.config.developers.length > 0,
        type: 'list',
        name: 'developer',
        message: async () => 'And finally, which lovely developer is building this test?',
        choices: config.prompts.config.developers,
        default: config.prompts.config.developers[0],
        store: true
      },

      // Confirmation
      {
        type: 'confirm',
        name: 'confirm',
        message: async (response) => {
          const summary = Object.entries(response)
            .map(([key, value]) => `${convertToTitleCase(key)}: ${chalk.green(value)}`)
            .join('\n');
          
          const confirmText = await generateFigletText('Please confirm:');
          return `${confirmText}\n\n${summary}\n\nConfirm?`;
        },
        default: true
      }
    ];

    return prompts;
  } catch (error) {
    throw new PromptError(
      `Failed to generate prompts: ${error.message}`,
      'PROMPT_GEN_ERROR'
    );
  }
};