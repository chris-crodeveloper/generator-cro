/**
 * CRO Generator Configuration
 * Configuration template for setting up the CRO testing environment
 * 
 * @module croConfig
 * @version 1.0.0
 */

require("dotenv").config();

module.exports = {
  /**
   * Optimizely Configuration
   * Settings for Optimizely integration and test naming
   */
  optimizely: {
    // Format for test names in Optimizely
    // Available variables: <%= testId %>, <%= testName %>, <%= optimizely.testType %>
    testNameFormat: '',
    
    // Array of Optimizely project configurations
    // Example:
    // {
    //   project_name: 'Production',
    //   auth_token: 'your-auth-token',
    //   project_id: '12345678',
    //   audiences: {
    //     'desktop': '98765432',
    //     'mobile': '12345678'
    //   },
    //   default: true
    // }
    projects: [],
  },

  /**
   * Input Configuration
   * Settings for prompts and file generation
   */
  prompts: {
    /**
     * General configuration settings
     */
    config: {
      // Optional child folder organization
      childFolders: [],

      // List of developers for assignment
      developers: [],

      // Default homepage URL for testing
      homepageUrl: "https://www.crodeveloper.com/",

      // Example format for test IDs
      testIdExample: "CRO-1",

      // Example format for test names
      testNameExample: "My First CRO Test",
    },

    /**
     * File type configurations
     * Define which files to generate and their default settings
     */
    files: {
      // HTML template files
      html: {
        showInPrompts: true,    // Show in file selection prompt
        checkedByDefault: true, // Selected by default
      },

      // Shared code files
      shared: {
        showInPrompts: true,
        checkedByDefault: true,
      },

      // Control version files
      control: {
        showInPrompts: true,
        checkedByDefault: true,
      },

      // Variation files
      variation: {
        showInPrompts: true,
        checkedByDefault: true,
      },

      // JavaScript files
      js: {
        showInPrompts: true,
        checkedByDefault: true,
      },

      // CSS files
      css: {
        showInPrompts: false,
        checkedByDefault: true,
      },

      // README documentation
      readme: {
        showInPrompts: true,
        checkedByDefault: true,
        fileExtension: "md",     // Use markdown extension
        singleFile: true,        // Generate single file instead of variations
      },

      // SCSS style files
      scss: {
        showInPrompts: true,
        checkedByDefault: false,
      },

      // Tampermonkey scripts
      tampermonkey: {
        showInPrompts: false,
        checkedByDefault: false,
        fileExtension: "js",
      },

      // Cypress test files
      cypress: {
        showInPrompts: false,
        checkedByDefault: false,
        singleFile: true,
        fileExtension: "js",
      },
    },
  },

  /**
   * Output Configuration
   * Settings for file generation output
   */
  output: {
    // Directory where tests will be generated
    destination: "_tests",

    // Optional localhost URL for local development
    // Example: "http://localhost:3000"
    localhost: "",
  },

  /**
   * Custom Templates Configuration
   * Settings for custom template usage
   */
  templates: {
    // Directory containing custom templates
    customDirectory: "_templates",

    // Default custom template to use (optional)
    // Set to template name to always use a specific template
    defaultCustomTemplate: ""
  },
};