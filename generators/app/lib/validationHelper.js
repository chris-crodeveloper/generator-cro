/**
 * Validation Helper Module
 * Provides input validation utilities for the CRO generator
 * @module validationHelper
 */

import chalk from "chalk";

/**
 * Custom error for validation operations
 */
class ValidationError extends Error {
  constructor(message, code, value) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.value = value;
  }
}

/**
 * Error messages for different validation scenarios
 * @private
 */
const ERROR_MESSAGES = {
  EMPTY_VALUE: 'Cannot be an empty value',
  INVALID_OPTIMIZELY_ID_LENGTH: 'The Optimizely ID must be at least 16 characters long',
  INVALID_OPTIMIZELY_ID_FORMAT: 'The Optimizely ID must contain only numbers',
  NOT_A_NUMBER: 'Value must be a number',
  INVALID_INPUT: 'Invalid input provided'
};

/**
 * Validation patterns
 * @private
 */
const VALIDATION_PATTERNS = {
  NUMBERS_ONLY: /^[0-9]+$/
};

/**
 * Wraps error messages with chalk styling
 * @private
 * @param {string} message - Error message to style
 * @returns {string} Styled error message
 */
const formatError = (message) => chalk.red(message);

/**
 * Validates input value type
 * @private
 * @param {*} value - Value to validate
 * @throws {ValidationError} If value is invalid
 */
const validateInput = (value) => {
  if (value === undefined || value === null) {
    throw new ValidationError(
      ERROR_MESSAGES.INVALID_INPUT,
      'INVALID_INPUT',
      value
    );
  }
};

/**
 * Checks if a string contains only numbers
 * @private
 * @param {string} value - Value to check
 * @returns {boolean} True if string contains only numbers
 */
const isOnlyNumbers = (value) => {
  try {
    validateInput(value);
    return VALIDATION_PATTERNS.NUMBERS_ONLY.test(String(value));
  } catch (error) {
    return false;
  }
};

/**
 * Validates that a value is not empty
 * @param {string} value - Value to validate
 * @returns {true|string} True if valid, error message if invalid
 */
export const isNotEmpty = (value) => {
  try {
    validateInput(value);
    
    if (typeof value !== 'string') {
      return formatError(ERROR_MESSAGES.INVALID_INPUT);
    }

    if (value.trim() === '') {
      return formatError(ERROR_MESSAGES.EMPTY_VALUE);
    }

    return true;
  } catch (error) {
    return formatError(error.message);
  }
};

/**
 * Validates an Optimizely ID
 * @param {string} value - Value to validate
 * @returns {true|string} True if valid, error message if invalid
 */
export const optimizelyIdValidation = (value) => {
  try {
    validateInput(value);

    const trimmedValue = String(value).trim();

    if (trimmedValue.length < 17) {
      return formatError(ERROR_MESSAGES.INVALID_OPTIMIZELY_ID_LENGTH);
    }

    if (!isOnlyNumbers(trimmedValue)) {
      return formatError(ERROR_MESSAGES.INVALID_OPTIMIZELY_ID_FORMAT);
    }

    return true;
  } catch (error) {
    return formatError(error.message);
  }
};

/**
 * Validates that a value is a number
 * @param {string|number} value - Value to validate
 * @returns {true|string} True if valid, error message if invalid
 */
export const isNumber = (value) => {
  try {
    validateInput(value);

    // Handle both string and number inputs
    const stringValue = String(value).trim();

    if (!isOnlyNumbers(stringValue)) {
      return formatError(ERROR_MESSAGES.NOT_A_NUMBER);
    }

    return true;
  } catch (error) {
    return formatError(error.message);
  }
};

/**
 * Validates a URL string
 * @param {string} value - URL to validate
 * @returns {true|string} True if valid, error message if invalid
 */
export const isValidUrl = (value) => {
  try {
    validateInput(value);

    if (typeof value !== 'string') {
      return formatError('Invalid URL format');
    }

    try {
      new URL(value);
      return true;
    } catch {
      return formatError('Invalid URL format');
    }
  } catch (error) {
    return formatError(error.message);
  }
};

/**
 * Validates an ID string (alphanumeric with hyphens and underscores)
 * @param {string} value - ID to validate
 * @returns {true|string} True if valid, error message if invalid
 */
export const isValidId = (value) => {
  try {
    validateInput(value);

    if (typeof value !== 'string') {
      return formatError('Invalid ID format');
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
      return formatError('ID can only contain letters, numbers, hyphens, and underscores');
    }

    return true;
  } catch (error) {
    return formatError(error.message);
  }
};

/**
 * Validates a string length
 * @param {string} value - String to validate
 * @param {Object} options - Validation options
 * @param {number} [options.min] - Minimum length
 * @param {number} [options.max] - Maximum length
 * @returns {true|string} True if valid, error message if invalid
 */
export const isValidLength = (value, { min, max } = {}) => {
  try {
    validateInput(value);

    if (typeof value !== 'string') {
      return formatError('Invalid input type');
    }

    const length = value.trim().length;

    if (min !== undefined && length < min) {
      return formatError(`Must be at least ${min} characters long`);
    }

    if (max !== undefined && length > max) {
      return formatError(`Must not exceed ${max} characters`);
    }

    return true;
  } catch (error) {
    return formatError(error.message);
  }
};

/**
 * Combines multiple validators
 * @param {...Function} validators - Validator functions to combine
 * @returns {Function} Combined validator function
 */
export const combineValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const result = validator(value);
    if (result !== true) {
      return result;
    }
  }
  return true;
};