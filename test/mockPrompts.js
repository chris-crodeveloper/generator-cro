/**
 * Mock Prompts Module
 * Provides mock prompt data for testing the CRO generator
 * @module mockPrompts
 */

/**
 * Optimizely test creation types
 * @readonly
 * @enum {string}
 */
export const TEST_CREATION_TYPES = {
  FILES_ONLY: 'Files - create local files only',
  NEW_EXPERIMENT: 'New - create new experiment in Optimizely',
  EXISTING_EXPERIMENT: 'Existing - request existing experiment from Optimizely'
};

/**
 * Test file types
 * @readonly
 * @enum {string}
 */
export const FILE_TYPES = {
  JS: 'js',
  CSS: 'css',
  HTML: 'html',
  SCSS: 'scss',
  README: 'readme',
  CYPRESS: 'cypress',
  TAMPERMONKEY: 'tampermonkey'
};

/**
 * Test type options
 * @readonly
 * @enum {string}
 */
export const TEST_TYPES = {
  AB: 'a/b',
  FEATURE: 'feature',
  MULTIVARIANT: 'multivariant',
  PERSONALIZATION: 'personalization'
};

/**
 * Mock test data for basic test setup
 * @type {Object}
 */
const MOCK_TEST_DATA = {
  id: 'Test-123',
  name: 'Test 123 - My First Test',
  description: 'My First Test - created using Optimizely Generator',
  details: 'My First Test',
  url: 'www.optimizely.com',
  variationCount: '3'
};

/**
 * Mock Optimizely data
 * @type {Object}
 */
const MOCK_OPTIMIZELY_DATA = {
  experimentId: '12345678901',
  testType: TEST_TYPES.AB
};

/**
 * Default mock prompts configuration
 * Used for testing the CRO generator
 * @type {Object}
 */
const mockPrompts = {
  // Test Details
  testDetails: MOCK_TEST_DATA.details,
  testId: MOCK_TEST_DATA.id,
  testName: MOCK_TEST_DATA.name,
  testDescription: MOCK_TEST_DATA.description,
  testUrl: MOCK_TEST_DATA.url,
  variations: MOCK_TEST_DATA.variationCount,
  
  // Optimizely Configuration
  createOptimizelyTest: TEST_CREATION_TYPES.FILES_ONLY,
  useDefaultProject: 'No',
  optimizelyExperimentId: MOCK_OPTIMIZELY_DATA.experimentId,
  testType: MOCK_OPTIMIZELY_DATA.testType,
  
  // File Generation
  filesToGenerate: [FILE_TYPES.JS],
  childFolder: '',
  
  // Developer Info
  developer: 'Chris',
  
  // Confirmation
  confirm: 'Yes'
};

/**
 * Creates custom mock prompts with specified overrides
 * @param {Object} overrides - Values to override in default mock prompts
 * @returns {Object} Custom mock prompts
 */
export const createMockPrompts = (overrides = {}) => {
  return {
    ...mockPrompts,
    ...overrides
  };
};

/**
 * Creates mock prompts for Optimizely experiment creation
 * @param {Object} params - Experiment parameters
 * @returns {Object} Mock prompts for Optimizely experiment
 */
export const createOptimizelyExperimentPrompts = ({ 
  isNew = true,
  experimentId = MOCK_OPTIMIZELY_DATA.experimentId,
  testType = MOCK_OPTIMIZELY_DATA.testType
} = {}) => {
  return createMockPrompts({
    createOptimizelyTest: isNew ? TEST_CREATION_TYPES.NEW_EXPERIMENT : TEST_CREATION_TYPES.EXISTING_EXPERIMENT,
    optimizelyExperimentId: experimentId,
    testType
  });
};

/**
 * Creates mock prompts for file generation tests
 * @param {string[]} fileTypes - Array of file types to generate
 * @returns {Object} Mock prompts for file generation
 */
export const createFileGenerationPrompts = (fileTypes = [FILE_TYPES.JS]) => {
  return createMockPrompts({
    filesToGenerate: fileTypes
  });
};

/**
 * Creates mock prompts for child folder tests
 * @param {string} folderName - Child folder name
 * @returns {Object} Mock prompts with child folder
 */
export const createChildFolderPrompts = (folderName) => {
  return createMockPrompts({
    childFolder: folderName
  });
};

/**
 * Validates mock prompt data
 * @param {Object} prompts - Prompt data to validate
 * @returns {Object} Validation result
 */
export const validateMockPrompts = (prompts) => {
  const errors = [];

  // Required fields
  const requiredFields = ['testId', 'testName', 'testUrl', 'filesToGenerate'];
  requiredFields.forEach(field => {
    if (!prompts[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate test type if creating Optimizely experiment
  if (prompts.createOptimizelyTest === TEST_CREATION_TYPES.NEW_EXPERIMENT) {
    if (!Object.values(TEST_TYPES).includes(prompts.testType)) {
      errors.push('Invalid test type');
    }
  }

  // Validate file types
  if (Array.isArray(prompts.filesToGenerate)) {
    prompts.filesToGenerate.forEach(fileType => {
      if (!Object.values(FILE_TYPES).includes(fileType)) {
        errors.push(`Invalid file type: ${fileType}`);
      }
    });
  } else {
    errors.push('filesToGenerate must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default mockPrompts;