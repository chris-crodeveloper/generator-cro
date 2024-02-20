/**
 * MOCK genopti.config.js for Unit TEsting
 * Contains the configuration for the Optimizely Generator
 */

// Add import for cro-web-development here - if it exists overwrite the below

export default {
  optimizely: {
    projects: [],
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
};
