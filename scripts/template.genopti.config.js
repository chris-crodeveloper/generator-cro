/**
 * genopti.config.js
 * Contains the configuration for the Optimizely Generator
 * This generator can be used in conjunction with the npm package 'cro-web-development' (ADD URL HERE).
 */

// Add import for cro-web-development here - if it exists overwrite the below
module.exports = {
  optimizely: {
    projects: [],
  },

  // Input configuation
  prompts: {
    config: {
      childFolders: [],
      developers: [],
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
        showInPrompts: false,
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
        showInPrompts: false,
        checkedByDefault: false,
        fileExtension: "js",
      },
      cypress: {
        showInPrompts: false,
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
};
