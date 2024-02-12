/**
 * validationHelper
 * Contains validation helper functions for the Generator prompts
 */

import chalk from "chalk";

/**
 * @function isNotEmpty
 * @param {string} value
 * @returns {boolean}
 * Checks if string is not empty
 */
export const isNotEmpty = (value) => {
  if (value.trim() === "") {
    return chalk.red("Cannot be an empty value");
  }

  return true;
};

/**
 * @function optimizelyIdValidation
 * @param {string} value
 * @returns {boolean}
 * Checks for a valid Optimizely ID
 */
export const optimizelyIdValidation = (value) => {
  if (value.trim().length !== 11) {
    return chalk.red("The Optimizely ID has to be 11 numbers long");
  }
  if (!isOnlyNumbers(value.trim().length)) {
    return chalk.red("The Optimizely ID must be numbers only");
  }
  return true;
};

/**
 * @function isNumber
 * @param {string} value
 * @returns {boolean}
 * Checks if value only contains numbers
 */
export const isNumber = (value) => {
  if (!isOnlyNumbers(value)) {
    return chalk.red("Value must be a number");
  }
  return true;
};

/**
 * @function isOnlyNumbers
 * @param {string} value
 * @returns {boolean}
 * Regex for numbers onlys
 */
const isOnlyNumbers = (value) => {
  return /^[0-9]+$/.test(value);
};
