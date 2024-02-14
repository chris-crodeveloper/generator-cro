/**
 * Optimizely
 * Contains functions to call the Optimizely REST API - https://library.optimizely.com/docs/api/app/v2/index.html
 */

/**
 * @function fetchOptimizelyExperiment
 * @param {string} experimentId Optimizely Experiment ID
 *
 */
export const fetchOptimizelyExperiment = async (experimentId, authToken) => {
  const url = `https://api.optimizely.com/v2/experiments/${experimentId}`;
  const options = {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${authToken}`,
    }),
  };

  const response = await fetch(url, options);
  const json = await response.json();
  return json;
};

/**
 * @function createOptimizelyExperiment
 * @param {string} experimentId Optimizely Experiment ID
 *
 */
export const createOptimizelyExperiment = async (authToken, payload) => {
  try {
    const url = `https://api.optimizely.com/v2/experiments`;

    const bodyPayload = JSON.stringify(payload);
    console.log("JSON.stringify(payload)", bodyPayload);
    const options = {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        body: bodyPayload,
      }),
    };

    const response = await fetch(url, options);

    console.log("response", response);

    const json = await response.json();

    console.log("JSON", json);
  } catch (error) {
    console.log("Error:", error);
  }
};

/**
 * Optimizely - generate request payload to create experiment
 * @function optimizelyPayload
 * @param {string} values
 * @return {object} payload - new metrics data - https://library.optimizely.com/docs/api/app/v2/index.html#tag/Experiments/operation/create_experiment
 */
export const optimizelyPayload = ({
  noOfVariations,
  description,
  testName,
  projectId,
  testType,
  testUrl,
  audiences,
}) => {
  // setup variations array
  const variations = [];
  const numberOfVariations = parseInt(noOfVariations) + 1;
  const finalWeight =
    10000 % numberOfVariations !== 0
      ? 10000 - parseInt(10000 / numberOfVariations) * (numberOfVariations - 1)
      : parseInt(10000 / numberOfVariations);

  // Add one to the variations for control/original
  for (let i = 0; i < numberOfVariations; i++) {
    variations.push({
      actions: [],
      name: i == 0 ? "Original" : `Variation #${i}`,
      status: "active",
      weight:
        i === numberOfVariations - 1
          ? finalWeight
          : parseInt(10000 / numberOfVariations),
    });
  }

  // Setup audiences
  let audience_conditions = "everyone";
  let audienceNames = Object.keys(audiences);
  if (audienceNames.length) {
    audience_conditions = `[\"and\",`;
    audienceNames.forEach((name, index) => {
      audience_conditions += `{\"audience_id\": ${audiences[name]}${
        index < audienceNames.length - 1 ? `,` : ``
      }}`;
    });
    audience_conditions += `]`;
  }

  console.log("audience_conditions", audience_conditions);

  console.log({
    noOfVariations,
    description,
    testName,
    projectId,
    testType,
    testUrl,
    audiences,
  });

  // Return minimal payload
  return {
    audience_conditions: audience_conditions,
    changes: [],
    metrics: [],
    description: description,
    name: testName,
    project_id: parseInt(projectId),
    status: "not_started",
    traffic_allocation: 10000,
    type: testType,
    url_targeting: {
      activation_type: "immediate",
      edit_url: testUrl,
      conditions: `[\"and\", [\"or\", {\"match_type\": \"simple\", \"type\": \"url\", \"value\": \"${testUrl}\"}]]`,
    },
    variations: variations,
  };
};

/**
 * Optimizely Test Types
 */

export const testTypes = [
  "a/b",
  "feature",
  "multivariant",
  "personalization",
  "multiarmed_bandit",
];
