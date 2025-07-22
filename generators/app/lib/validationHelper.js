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
  try {
    if (value.trim() === "") {
      return chalk.red("Cannot be an empty value");
    }

    return true;
  } catch (error) {
    console.log('validationHelper.js - isNotEmpty() - error: ' + error)
  }
};

/**
 * @function optimizelyIdValidation
 * @param {string} value
 * @returns {boolean}
 * Checks for a valid Optimizely ID
 */
export const optimizelyIdValidation = (value) => {
  try {
    if (value.trim().length < 11) {
      return chalk.red("The Optimizely ID has to be 11 numbers long");
    }
    if (!isOnlyNumbers(value.trim().length)) {
      return chalk.red("The Optimizely ID must be numbers only");
    }
    return true;
  } catch (error) {
    console.log('validationHelper.js - optimizelyIdValidation() - error: ' + error)
  }
};

/**
 * @function isNumber
 * @param {string} value
 * @returns {boolean}
 * Checks if value only contains numbers
 */
export const isNumber = (value) => {
  try {
    if (!isOnlyNumbers(value)) {
      return chalk.red("Value must be a number");
    }
    return true;
  } catch (error) {
    console.log('validationHelper.js - isNumber() - error: ' + error)
  }
  
};

/**
 * @function isOnlyNumbers
 * @param {string} value
 * @returns {boolean}
 * Regex for numbers onlys
 */
const isOnlyNumbers = (value) => {
  try {
    return /^[0-9]+$/.test(value);
  } catch (error) {
    console.log('validationHelper.js - isOnlyNumbers() - error: ' + error)
  }

};
