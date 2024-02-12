/**
 * MOCK genopti.config.js for Unit TEsting
 * Contains the configuration for the Optimizely Generator
 */

// Add import for cro-web-development here - if it exists overwrite the below

export default {
  optimizely: {
    // Set defaults when working with a single project
    project_defaults: {
      // Optimizely Auth Token for the current user
      auth_token: "",

      // default project ID, this will be used for Optimizely fetches
      default_project_id: "",

      // default audiences
      default_audiences: {
        "audience-1-name": "audience-1-id",
        "audience-2-name": "audience-2-id",
      },
    },
  },

  // Input configuation
  prompts: {
    config: {
      childFolders: ["testChildFolder"],
      developers: ["Chris", "Pushkal", "Josh"],
      homepageUrl: "https://www.optimizely.com/",
      testIdExample: "OPTI-1",
      testNameExample: "My First Optimizely Test",
    },
    files: {
      html: {
        showInPrompts: true,
        checkedByDefault: true,
      },
      shared: {
        showInPrompts: true,
        checkedByDefault: true,
      },
      control: {
        showInPrompts: true,
        checkedByDefault: true,
      },
      variation: {
        showInPrompts: true,
        checkedByDefault: true,
      },
      js: {
        showInPrompts: true,
        checkedByDefault: true,
      },
      css: {
        showInPrompts: true,
        checkedByDefault: true,
      },
      readme: {
        showInPrompts: true,
        checkedByDefault: true,
        fileExtension: "md",
        singleFile: true,
      },
      scss: {
        showInPrompts: true,
        checkedByDefault: false,
      },
      tampermonkey: {
        showInPrompts: true,
        checkedByDefault: false,
        fileExtension: "js",
      },
      cypress: {
        showInPrompts: true,
        checkedByDefault: false,
        singleFile: true,
        fileExtension: "js",
      },
    },
  },

  // Output configuation
  output: {
    destination: "_tests",
    localhost: "",
  },

  // Custom Templates
  templates: {
    customDirectory: "_custom-templates",
  },

  // Extra resources added to the templates
  resources: {
    tampermonkey: true,
    cypress: true,
    scss: true,
  },
};
