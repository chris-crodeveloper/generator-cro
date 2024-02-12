/**
 * Opti Config Validation
 * Validate to confirm the config file has been setup to the minimum
 */

/**
 * @function validateConfigFile
 * @param {object} config - opti config file
 */

export const validateConfigFile = (config) => {
  // Mandatory fields validation
  const validation = {
    errors: [],
    warnings: [],
  };

  // Errors
  // Output destination
  if (!config.output.destination)
    validation.errors.push("opti.config.js: ERROR: No output destination set.");

  // Warnings
  // Optimizely Project ID
  if (!config.optimizely.project_defaults.default_project_id)
    validation.warnings.push(
      "opti.config.js: WARNING: No Optimizely project ID set - add one to utilize the API"
    );

  if (!config.optimizely.project_defaults.auth_token)
    validation.warnings.push(
      "opti.config.js: WARNING: No Optimizely auth token set - add one to utilize the API"
    );

  return validation;
};
