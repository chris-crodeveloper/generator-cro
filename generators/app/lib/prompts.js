import {
  isNotEmpty,
  optimizelyIdValidation,
  isNumber,
} from "./validationHelper";
import figlet from "figlet";
import chalk from "chalk";
import genoptiConfig from "~/genopti.config";

// List of prompts to gather information about the test
export default [
  {
    type: "list",
    name: "welcome",
    message: async () => {
      const figletText = await generateFigletText("Welcome!");
      return `${figletText}\n\n To the Optimizely generator, confirm the genopti.config.js file is populated before continuing`;
    },
    choices: ["Yes", "No"],
  },
  {
    when: function (responses) {
      return responses.welcome === "Yes";
    },
    type: "input",
    name: "testDetails",
    message: async () => {
      return `Please enter the URL to the test details (eg JIRA, Trello etc)`;
    },
  },
  {
    when: function (responses) {
      return responses.welcome === "Yes";
    },
    type: "list",
    name: "createOptimizelyTest",
    message: async () => {
      return `Does this test already exist in Optimizely? \nIf no, it will be created \nIf yes, then the details will be requested from Optimizely.`;
    },
    choices: ["Yes", "No"],
  },
  {
    when: function (responses) {
      return (
        responses.welcome === "Yes" && responses.createOptimizelyTest === "No"
      );
    },
    type: "input",
    name: "optimizelyIdExperiment",
    message: async () => {
      return `Please enter the Optimizely experiment ID:`;
    },
    validate: optimizelyIdValidation,
  },
  {
    when: function (responses) {
      return (
        responses.welcome === "Yes" && responses.createOptimizelyTest === "No"
      );
    },
    type: "list",
    name: "testType",
    message: async () => {
      return `Please select the test type: `;
    },
    default: genoptiConfig.optimizely.testTypes[0],
    choices: genoptiConfig.optimizely.testTypes,
  },
  {
    when: function (responses) {
      return responses.welcome === "Yes";
    },
    type: "input",
    name: "testId",
    message: async () => {
      return `Please enter the test ID (this is used to namespace the test - eg ${genoptiConfig.prompts.config.testIdExample}):`;
    },
    validate: isNotEmpty,
  },
  {
    when: function (responses) {
      return responses.welcome === "Yes";
    },
    type: "input",
    name: "testName",
    message: async () => {
      return `Please enter the test name - eg ${genoptiConfig.prompts.config.testNameExample}):`;
    },
    validate: isNotEmpty,
  },
  {
    when: function (responses) {
      return (
        responses.welcome === "Yes" && responses.createOptimizelyTest === "Yes"
      );
    },
    type: "input",
    name: "testDescription",
    message: async () => {
      return `Please enter the test description (optional):`;
    },
  },
  {
    when: function (responses) {
      return (
        responses.welcome === "Yes" && responses.createOptimizelyTest === "Yes"
      );
    },
    type: "input",
    name: "variations",
    message: async () => {
      return `Please enter the number of variations (not including control):`;
    },
    default: 1,
    validate: isNumber,
  },
  {
    when: function (responses) {
      return responses.welcome === "Yes";
    },
    type: "input",
    name: "testUrl",
    message: async () => {
      return `Please enter the URL the test will run on:`;
    },
    default: genoptiConfig.prompts.config.homepageUrl,
  },
  {
    when: function (responses) {
      return (
        responses.welcome === "Yes" &&
        genoptiConfig.prompts.config.childFolders.length
      );
    },
    type: "list",
    name: "testArea",
    message: async () => {
      return `Please select the test area:`;
    },
    default: genoptiConfig.prompts.config.childFolders[0],
    choices: genoptiConfig.prompts.config.childFolders,
  },
  {
    when: function (responses) {
      return responses.welcome === "Yes";
    },
    type: "list",
    name: "filesToGenerate",
    message: async () => {
      return `Please select the files required to build locally:`;
    },
    choices: getFilesArray,
  },
  {
    when: function (responses) {
      return (
        responses.welcome === "Yes" &&
        genoptiConfig.prompts.config.developers.length
      );
    },
    type: "list",
    name: "developer",
    message: async () => {
      return `And finally, which lovely developer is building this test?`;
    },
    choices: genoptiConfig.prompts.config.developers,
    store: true,
  },
  {
    type: "confirm",
    name: "confirm",
    message: async (response) => {
      let answers = "";

      for (let key in response) {
        answers += `${convertString(key)}: ${chalk.green(response[key])}\n`;
      }
      const figletText = await generateFigletText("Please confirm:");
      return `${figletText}\n\n${answers}\nConfirm?`;
    },
    default: true,
  },
];

/**
 * @function generateFigletText
 * @param {string} text
 * @returns figletText
 * Generates a figlet ASCII text
 */
async function generateFigletText(text) {
  return new Promise((resolve, reject) => {
    figlet.text(text, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * @function getFilesArray
 * @returns {Array}
 * Compiles list of files depending on config settings
 */
function getFilesArray() {
  const filesArray = [
    {
      name: "html",
      value: "html",
      checked: genoptiConfig.prompts.overrides.html,
    },
    {
      name: "shared files",
      value: "shared",
      checked: genoptiConfig.prompts.overrides.shared,
    },
    {
      name: "control files",
      value: "control",
      checked: genoptiConfig.prompts.overrides.control,
    },
    {
      name: "variation files",
      value: "variation",
      checked: genoptiConfig.prompts.overrides.variation,
    },
    {
      name: "js",
      value: "js",
      checked: genoptiConfig.prompts.overrides.js,
    },
    {
      name: "tampermonkey",
      value: "tampermonkey",
      checked: genoptiConfig.prompts.overrides.tampermonkey,
    },
    {
      name: "README",
      value: "README",
      checked: genoptiConfig.prompts.overrides.readme,
    },
  ];

  // Add SCSS / CSS files
  if (genoptiConfig.resources.scss) {
    filesArray.push({
      name: "scss",
      value: "scss",
      checked: genoptiConfig.prompts.overrides.scss,
    });
  } else {
    filesArray.push({
      name: "css",
      value: "css",
      checked: genoptiConfig.prompts.overrides.css,
    });
  }

  // Add tampermonkey files
  if (genoptiConfig.resources.tampermonkey) {
    filesArray.push({
      name: "tampermonkey",
      value: "tampermonkey",
      checked: genoptiConfig.prompts.overrides.tampermonkey,
    });
  }

  // Add cypress files
  if (genoptiConfig.resources.tampermonkey) {
    filesArray.push({
      name: "cypress",
      value: "cypress",
      checked: genoptiConfig.prompts.overrides.cypress,
    });
  }

  return filesArray;
}

/**
 * @function convertString
 * @param {string} inputString
 * @returns convertedString
 */
function convertString(inputString) {
  // Add spaces before capital letters
  const stringWithSpaces = inputString.replace(/([A-Z])/g, " $1");

  // Capitalize the first letter of each word
  const words = stringWithSpaces.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back into a string
  const convertedString = capitalizedWords.join(" ");

  return convertedString;
}
