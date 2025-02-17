/**
 * Optimizely API Integration Module
 * Handles interactions with Optimizely REST API
 * @module optimizely
 */

/**
 * Custom error class for Optimizely API related errors
 */
class OptimizelyAPIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'OptimizelyAPIError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Supported Optimizely test types
 * @readonly
 * @enum {string}
 */
export const TEST_TYPES = Object.freeze({
  AB: 'a/b',
  FEATURE: 'feature',
  MULTIVARIANT: 'multivariant',
  PERSONALIZATION: 'personalization',
  MULTIARMED_BANDIT: 'multiarmed_bandit'
});

/**
 * API configuration
 * @private
 */
const API_CONFIG = {
  BASE_URL: 'https://api.optimizely.com/v2',
  HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};

/**
 * Validates the authentication token
 * @private
 * @param {string} authToken - Optimizely authentication token
 * @throws {OptimizelyAPIError} If auth token is invalid
 */
const validateAuthToken = (authToken) => {
  if (!authToken || typeof authToken !== 'string') {
    throw new OptimizelyAPIError(
      'Invalid authentication token',
      401,
      'INVALID_AUTH_TOKEN'
    );
  }
};

/**
 * Handles API response
 * @private
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Parsed response data
 * @throws {OptimizelyAPIError} If response indicates an error
 */
const handleApiResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new OptimizelyAPIError(
      data.message || 'API request failed',
      response.status,
      data.code || 'API_ERROR'
    );
  }

  return data;
};

/**
 * Creates headers with authentication
 * @private
 * @param {string} authToken - Authentication token
 * @returns {Headers} Request headers
 */
const createAuthHeaders = (authToken) => {
  return new Headers({
    ...API_CONFIG.HEADERS,
    Authorization: `Bearer ${authToken}`
  });
};

/**
 * Fetches an Optimizely experiment by ID
 * @async
 * @param {string} experimentId - Optimizely experiment ID
 * @param {string} authToken - Authentication token
 * @returns {Promise<Object>} Experiment data
 * @throws {OptimizelyAPIError} If the request fails
 */
export const fetchOptimizelyExperiment = async (experimentId, authToken) => {
  try {
    validateAuthToken(authToken);

    if (!experimentId) {
      throw new OptimizelyAPIError(
        'Experiment ID is required',
        400,
        'MISSING_EXPERIMENT_ID'
      );
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/experiments/${experimentId}`,
      {
        method: 'GET',
        headers: createAuthHeaders(authToken)
      }
    );

    return handleApiResponse(response);
  } catch (error) {
    if (error instanceof OptimizelyAPIError) {
      throw error;
    }
    throw new OptimizelyAPIError(
      `Failed to fetch experiment: ${error.message}`,
      500,
      'FETCH_ERROR'
    );
  }
};

/**
 * Creates a new Optimizely experiment
 * @async
 * @param {string} authToken - Authentication token
 * @param {Object} payload - Experiment configuration payload
 * @returns {Promise<Object>} Created experiment data
 * @throws {OptimizelyAPIError} If the request fails
 */
export const createOptimizelyExperiment = async (authToken, payload) => {
  try {
    validateAuthToken(authToken);

    if (!payload || typeof payload !== 'object') {
      throw new OptimizelyAPIError(
        'Invalid payload',
        400,
        'INVALID_PAYLOAD'
      );
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/experiments`,
      {
        method: 'POST',
        headers: createAuthHeaders(authToken),
        body: JSON.stringify(payload)
      }
    );

    return handleApiResponse(response);
  } catch (error) {
    if (error instanceof OptimizelyAPIError) {
      throw error;
    }
    throw new OptimizelyAPIError(
      `Failed to create experiment: ${error.message}`,
      500,
      'CREATE_ERROR'
    );
  }
};

/**
 * Generates variations array for experiment payload
 * @private
 * @param {number} count - Number of variations
 * @returns {Array<Object>} Array of variation configurations
 */
const generateVariations = (count) => {
  const variations = [];
  const totalWeight = 10000;
  const baseWeight = Math.floor(totalWeight / (count + 1));
  const remainingWeight = totalWeight - (baseWeight * count);

  for (let i = 0; i <= count; i++) {
    variations.push({
      actions: [],
      name: i === 0 ? 'Original' : `Variation #${i}`,
      status: 'active',
      weight: i === count ? baseWeight + remainingWeight : baseWeight
    });
  }

  return variations;
};

/**
 * Generates audience conditions string
 * @private
 * @param {Object} audiences - Audience configuration
 * @returns {string} Formatted audience conditions
 */
const generateAudienceConditions = (audiences) => {
  if (!audiences || Object.keys(audiences).length === 0) {
    return 'everyone';
  }

  const conditions = Object.entries(audiences)
    .map(([_, id]) => `{"audience_id": ${id}}`)
    .join(',');

  return `["and",${conditions}]`;
};

/**
 * Generates experiment creation payload
 * @param {Object} config - Experiment configuration
 * @param {number} config.noOfVariations - Number of variations
 * @param {string} config.description - Experiment description
 * @param {string} config.testName - Experiment name
 * @param {string|number} config.projectId - Project ID
 * @param {string} config.testType - Test type
 * @param {string} config.testUrl - Test URL
 * @param {Object} config.audiences - Audience configuration
 * @returns {Object} Formatted payload for experiment creation
 * @throws {OptimizelyAPIError} If configuration is invalid
 */
export const optimizelyPayload = ({
  noOfVariations,
  description,
  testName,
  projectId,
  testType,
  testUrl,
  audiences
}) => {
  try {
    // Validate inputs
    if (!testName || !projectId || !testUrl) {
      throw new OptimizelyAPIError(
        'Missing required fields',
        400,
        'INVALID_CONFIG'
      );
    }

    if (!Object.values(TEST_TYPES).includes(testType)) {
      throw new OptimizelyAPIError(
        'Invalid test type',
        400,
        'INVALID_TEST_TYPE'
      );
    }

    const variations = generateVariations(parseInt(noOfVariations, 10));
    const audience_conditions = generateAudienceConditions(audiences);

    return {
      audience_conditions,
      changes: [],
      metrics: [],
      description: description || '',
      name: testName,
      project_id: parseInt(projectId, 10),
      status: 'not_started',
      traffic_allocation: 10000,
      type: testType,
      url_targeting: {
        activation_type: 'immediate',
        edit_url: testUrl,
        conditions: `["and", ["or", {"match_type": "simple", "type": "url", "value": "${testUrl}"}]]`
      },
      variations
    };
  } catch (error) {
    if (error instanceof OptimizelyAPIError) {
      throw error;
    }
    throw new OptimizelyAPIError(
      `Failed to generate payload: ${error.message}`,
      500,
      'PAYLOAD_ERROR'
    );
  }
};