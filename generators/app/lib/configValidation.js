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

  const optiDefault = config.optimizely.projects.filter(
    (project) => project.default
  );

  // Errors
  // Output destination
  if (!config.output.destination)
    validation.errors.push("opti.config.js: ERROR: No output destination set.");

  // Warnings
  // Optimizely Project ID
  if (!optiDefault[0])
    validation.warnings.push(
      "genopti.config.js: WARNING: No default Optimizely project set - add one to utilize the API"
    );

  if (optiDefault[0] && !optiDefault[0].project_id)
    validation.warnings.push(
      "genopti.config.js: WARNING: No Optimizely project ID set - add one to utilize the API"
    );

  if (optiDefault[0] && !optiDefault[0].auth_token)
    validation.warnings.push(
      "genopti.config.js: WARNING: No Optimizely auth token set - add one to utilize the API"
    );

  return validation;
};
