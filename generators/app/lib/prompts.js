import {
  isNotEmpty,
  optimizelyIdValidation,
  isNumber,
} from "./validationHelper.js";
import figlet from "figlet";
import chalk from "chalk";
import { testTypes } from "./optimizely.js";

// List of prompts to gather information about the test
export const getPrompts = (context) => {
  const opticonfig = context.config.get("opticonfig");
  const optimizelyDefault = opticonfig.optimizely.projects.filter(
    (project) => project.default
  );
  const optimizelyProjects = opticonfig.optimizely.projects.map(
    (project) => project.project_name
  );
  return [
    {
      type: "input",
      name: "testDetails",
      message: async () => {
        const figletText = await generateFigletText("Welcome!");
        return `${figletText}\n\n To the Optimizely generator. \n\nPlease enter the URL to the test details (eg JIRA, Trello etc)`;
      },
      validate: isNotEmpty,
    },
    {
      when: function (responses) {
        return (
          optimizelyDefault[0].auth_token && optimizelyDefault[0].project_id
        );
      },
      type: "list",
      name: "createOptimizelyTest",
      message: async () => {
        return `How would you like the files created? `;
      },
      choices: [
        "New - create new experiment in Optimizely",
        "Existing - request existing experiment from Optimizely",
        "Files - create local files only",
      ],
    },
    {
      when: function (responses) {
        return (
          optimizelyDefault[0].auth_token &&
          optimizelyDefault[0].project_id &&
          opticonfig.optimizely.projects.length > 1 &&
          (responses.createOptimizelyTest.includes("Existing") ||
            responses.createOptimizelyTest.includes("New"))
        );
      },
      type: "confirm",
      name: "useDefaultProject",
      message: async () => {
        return `Continue with the Optimizely build in the ${chalk.green(
          optimizelyDefault[0].project_name
        )} project?`;
      },
    },
    {
      when: function (responses) {
        return (
          opticonfig.optimizely.projects.length > 1 &&
          !responses.useDefaultProject
        );
      },
      type: "list",
      name: "optimizelyProjectName",
      message: async () => {
        return `Which Optimizely project would you like to use? `;
      },
      choices: optimizelyProjects,
    },
    {
      when: function (responses) {
        return (
          !optimizelyDefault[0].auth_token || !optimizelyDefault[0].project_id
        );
      },
      type: "list",
      name: "createOptimizelyTest",
      message: async () => {
        return `How would you like the files created? `;
      },
      choices: ["Files - create local files only"],
    },
    {
      when: function (responses) {
        return responses.createOptimizelyTest.includes("Existing");
      },
      type: "input",
      name: "optimizelyExperimentId",
      message: async () => {
        return `Please enter the Optimizely experiment ID:`;
      },
      validate: optimizelyIdValidation,
    },
    {
      when: function (responses) {
        return responses.createOptimizelyTest.includes("New");
      },
      type: "list",
      name: "testType",
      message: async () => {
        return `Please select the test type: `;
      },
      default: testTypes[0],
      choices: testTypes,
    },
    {
      type: "input",
      name: "testId",
      message: async () => {
        return `Please enter the test ID (this is used to namespace the test - eg ${opticonfig.prompts.config.testIdExample}):`;
      },
      validate: isNotEmpty,
    },
    {
      when: function (responses) {
        return (
          responses.createOptimizelyTest.includes("New") ||
          responses.createOptimizelyTest.includes("Files")
        );
      },
      type: "input",
      name: "testName",
      message: async () => {
        return `Please enter the test name - eg ${opticonfig.prompts.config.testNameExample}):`;
      },
      validate: isNotEmpty,
    },
    {
      type: "input",
      name: "testDescription",
      message: async () => {
        return `Please enter the test description (optional):`;
      },
    },
    {
      when: function (responses) {
        return (
          responses.createOptimizelyTest.includes("New") ||
          responses.createOptimizelyTest.includes("Files")
        );
      },
      type: "input",
      name: "variations",
      message: async () => {
        return `Please enter the number of variations (not including control):`;
      },
      validate: isNumber,
    },
    {
      type: "input",
      name: "testUrl",
      message: async () => {
        return `Please enter the URL the test will run on:`;
      },
      default: opticonfig.prompts.config.homepageUrl,
      validate: isNotEmpty,
    },
    {
      when: function (responses) {
        return opticonfig.prompts.config.childFolders.length;
      },
      type: "list",
      name: "childFolder",
      message: async () => {
        return `Please select the test area:`;
      },
      default: opticonfig.prompts.config.childFolders[0],
      choices: opticonfig.prompts.config.childFolders,
    },
    {
      type: "checkbox",
      name: "filesToGenerate",
      message: async () => {
        return `Please select the files required to build locally:`;
      },
      choices: getFilesArray(opticonfig),
    },
    {
      when: function (responses) {
        return opticonfig.prompts.config.developers.length;
      },
      type: "list",
      name: "developer",
      message: async () => {
        return `And finally, which lovely developer is building this test?`;
      },
      choices: opticonfig.prompts.config.developers,
      default: opticonfig.prompts.config.developers[0],
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
};

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
function getFilesArray(opticonfig) {
  const filesArray = [];
  if (opticonfig.prompts.files) {
    const files = opticonfig.prompts.files;
    const fileKeys = Object.keys(files);
    fileKeys.forEach((key) => {
      if (files[key].showInPrompts) {
        filesArray.push({
          name: ` - ${key}`,
          value: key,
          checked: files[key].checkedByDefault,
        });
      }
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
