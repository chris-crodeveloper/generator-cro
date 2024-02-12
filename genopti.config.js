/**
 * genopti.config.js
 * Contains the configuration for the Optimizely Generator
 * This generator can be used in conjunction with the npm package 'cro-web-development' (ADD URL HERE).
 */

// Add import for cro-web-development here - if it exists overwrite the below

export default {
  optimizely: {
    // Optimizely Auth Token for the current user
    auth_token: "",

    // default project ID, this will be used for Optimizely fetches
    default_project_id: "",

    // Add all projects the auth token is valid for here
    projects: {
      "project-1-name": "project-1-id",
      "project-2-name": "project-2-id",
    },

    // Add all default audiences here, these will be added when creating an Optimizely Experiment
    default_audiences: {
      "audience-1-name": "audience-1-id",
      "audience-2-name": "audience-2-id",
    },
  },

  // Input configuation
  prompts: {
    config: {
      childFolders: [],
      developers: [],
      homepageUrl: "https://www.optimizely.com/",
      testIdExample: "OPTI-1",
      testNameExample: "My First Optimizely Test",
      pathToRepository: "",
      localhost: "",
    },
    defaults: {
      files: [
        {
          name: "html",
          showInPrompts: true,
          checkedByDefault: false,
        },
        {
          name: "shared",
          showInPrompts: true,
          checkedByDefault: false,
        },
        {
          name: "control",
          showInPrompts: true,
          checkedByDefault: false,
        },
        {
          name: "variation",
          showInPrompts: true,
          checkedByDefault: false,
        },
        {
          name: "js",
          showInPrompts: true,
          checkedByDefault: false,
        },
        {
          name: "css",
          showInPrompts: true,
          checkedByDefault: false,
        },
        {
          name: "sass",
          showInPrompts: true,
          checkedByDefault: false,
        },
        {
          name: "readme",
          showInPrompts: true,
          checkedByDefault: false,
        },
        {
          name: "tampermonkey",
          showInPrompts: true,
          checkedByDefault: false,
        },
        {
          name: "cypress",
          showInPrompts: true,
          checkedByDefault: false,
        },
      ],
    },
  },

  // Output configuation
  output: {
    destination: "_tests",
  },

  // Extra resources added to the templates
  resources: {
    tampermonkey: true,
    cypress: true,
    sass: true,
  },
};
