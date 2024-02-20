/**
 * @function getCustomTemplates
 * Check for any custom templates
 */

export const getCustomTemplates = (context, fs) => {
  try {
    const opticonfig = context.config.get("opticonfig");
    const customTemplateDirectory = `${context.contextRoot}\\${opticonfig.templates.customDirectory}`;

    const customTemplateChildren = fs.readdirSync(customTemplateDirectory);

    if (!customTemplateChildren) return null;

    // Get child folder names
    let customTemplateFolderNames = customTemplateChildren.filter((folder) =>
      fs.statSync(`${customTemplateDirectory}/${folder}`).isDirectory()
    );

    // if custom folders exist add the default option
    if (customTemplateFolderNames.length) {
      customTemplateFolderNames.unshift("default");
    }

    return customTemplateFolderNames;
  } catch (error) {
    return false;
  }
};

/**
 * @function setupTemplateVariables
 * @param {object} context - Yoeman context
 */
export const setupTemplateVariables = (context) => {
  try {
    const opticonfig = context.config.get("opticonfig");

    // Template Files
    const files = opticonfig.prompts.files;

    const dirPath = `${context.contextRoot}\\${
      opticonfig.output.destination
    }\\${
      context.answers.childFolder ? `${context.answers.childFolder}\\` : ""
    }${context.answers.testId}\\dist`;

    const serverPath = `${opticonfig.output.localhost}/${
      opticonfig.output.destination
    }/${context.answers.childFolder ? `${context.answers.childFolder}/` : ""}${
      context.answers.testId
    }/dist`;

    context.templateVariables = {};
    context.templateVariables.destinationPath = `${context.contextRoot}\\${
      opticonfig.output.destination
    }\\${
      context.answers.childFolder ? `${context.answers.childFolder}\\` : ""
    }${context.answers.testId}\\src`;

    const fileKeys = Object.keys(files);
    fileKeys.forEach((key) => {
      // Loop through files, adding paths to template object
      let extension = files[key].fileExtension ? files[key].fileExtension : key;

      // ignore generic file extensions
      if (["shared", "control", "variation"].includes(extension)) return;

      context.templateVariables[key] = {};
      context.templateVariables[
        key
      ].shared = `${dirPath}\\${key}\\shared.${extension}`;
      context.templateVariables[
        key
      ].control = `${dirPath}\\${key}\\control.${extension}`;
      context.templateVariables[key].variation = `${dirPath}\\${key}\\`;
      context.templateVariables[key].server = {};
      context.templateVariables[
        key
      ].server.shared = `${serverPath}/${key}/shared.${key}`;
      context.templateVariables[
        key
      ].server.control = `${serverPath}/${key}/control.${key}`;
      context.templateVariables[key].server.variation = `${serverPath}/${key}/`;
    });

    // Variables
    context.templateVariables.testDetails = context.answers.testDetails
      ? context.answers.testDetails
      : "";

    context.templateVariables.testId = context.answers.testId
      ? context.answers.testId
      : "";
    context.templateVariables.testName = context.answers.testName
      ? context.answers.testName
      : "";
    context.templateVariables.testUrl = context.answers.testUrl
      ? context.answers.testUrl
      : "";
    context.templateVariables.testDescription = context.answers.testDescription
      ? context.answers.testDescription
      : "";

    context.templateVariables.variations = context.answers.variations
      ? context.answers.variations
      : "";
    context.templateVariables.childFolder = context.answers.childFolder
      ? context.answers.childFolder
      : "";
    context.templateVariables.filesToGenerate = context.answers.filesToGenerate
      ? context.answers.filesToGenerate
      : "";
    context.templateVariables.developer = context.answers.developer
      ? context.answers.developer
      : "";
    context.templateVariables.customTemplate = context.answers.customTemplate
      ? context.answers.customTemplate
      : "";

    // Optimizely variables
    context.templateVariables.optimizely = {};

    // if Optimizely is configured, setup the Optimizely variables
    if (
      context.answers.createOptimizelyTest.includes("Existing") ||
      context.answers.createOptimizelyTest.includes("New")
    ) {
      let defaultProject = opticonfig.optimizely.projects.find(
        (project) => project.default
      );
      context.templateVariables.optimizely.project_name = context.answers
        .useDefaultProject
        ? defaultProject.project_name
        : context.answers.optimizelyProjectName;

      context.templateVariables.optimizely.experimentId = context.answers
        .optimizelyExperimentId
        ? context.answers.optimizelyExperimentId
        : "";
      context.templateVariables.optimizely.variationId = context.answers
        .optimizelyVariationId
        ? context.answers.optimizelyVariationId
        : "";
      context.templateVariables.optimizely.variationName = context.answers
        .optimizelyVariationName
        ? context.answers.optimizelyVariationName
        : "";

      context.templateVariables.optimizely.testType = context.answers.testType
        ? context.answers.testType
        : "";

      context.templateVariables.optimizely.requestType =
        context.answers.createOptimizelyTest.includes("Existing")
          ? "GET"
          : "POST";
    }
  } catch (error) {
    context.log(error);
  }
};

/**
 * @function setupOptimizelyTemplateVariables
 * @param {object} context - Yoeman context
 * @param {object} response - Optimizely Request Response
 */
export const setupOptimizelyTemplateVariables = (context, response) => {
  context.templateVariables.testName = response.name;
  context.templateVariables.variations = response.variations.length;
  context.templateVariables.variationData = [];

  // Loop through variations building variationData array
  response.variations.forEach((variation) => {
    context.templateVariables.variationData.push({
      variationName: variation.name,
      variationId: variation.variation_id,
    });
  });
};

/**
 * @function createFile
 * @param {object} context - context from yeoman
 * @param {string} templatePath - Path to the template file to copy
 * @param {string} destinationPath - Path to output destination
 */

export const createFile = (context, templatePath, destinationPath) => {
  try {
    // Create file
    context.fs.copyTpl(
      context.templatePath(templatePath),
      context.destinationPath(destinationPath),
      context.templateVariables
    );
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * @function getFormattedDate
 */

export const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  return `${day}/${month}/${year}`;
};