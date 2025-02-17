/**
 * CRO Generator Test Suite
 * Comprehensive tests for the CRO generator functionality
 */

import helpers from "yeoman-test";
import assert from "yeoman-assert";
import path from "path";
import { fileURLToPath } from "url";
import mockConfig from "./mockConfig.js";
import mockPrompts from "./mockPrompts.js";

// Test utilities and constants
const TEST_CONSTANTS = {
  TEST_DIR: path.dirname(fileURLToPath(import.meta.url)),
  TEMP_DIR: path.join(path.dirname(fileURLToPath(import.meta.url)), "temp"),
  GENERATOR_PATH: "../generators/app",
  CUSTOM_TEMPLATE_CONTENT: "CUSTOM TEMPLATE 1"
};

/**
 * Test utilities for common operations
 */
const TestUtils = {
  /**
   * Gets file path for test files
   * @param {string} relativePath - Relative path to file
   * @returns {string} Full file path
   */
  getFilePath(relativePath) {
    return path.join(TEST_CONSTANTS.TEMP_DIR, relativePath);
  },

  /**
   * Creates a generator instance with given prompts and config
   * @param {Object} params - Generator parameters
   * @returns {Promise} Generator instance
   */
  async createGenerator({ prompts = mockPrompts, config = mockConfig } = {}) {
    return helpers
      .run(path.join(TEST_CONSTANTS.TEST_DIR, TEST_CONSTANTS.GENERATOR_PATH))
      .withPrompts(prompts)
      .inDir(TEST_CONSTANTS.TEMP_DIR)
      .withOptions({ updatedMockConfig: config });
  },

  /**
   * Assert file existence and content
   * @param {string} filePath - Path to file
   * @param {string} content - Expected content
   */
  assertFileContent(filePath, content) {
    assert.file(filePath);
    assert.fileContent(filePath, content);
  },

  /**
   * Generates test file paths for variations
   * @param {Object} params - Path parameters
   * @returns {Array} Array of file paths
   */
  getVariationPaths({ type, count, childFolder = '' }) {
    return Array.from({ length: count }, (_, i) => 
      this.getFilePath(`_tests/${childFolder}/Test-123/src/${type}/variation-${i + 1}.${type}`)
    );
  }
};

describe("Generator Tests", () => {
  describe("File Creation", () => {
    it("should generate correct number of variation files", async () => {
      const testPrompts = {
        ...mockPrompts,
        variations: "4",
        filesToGenerate: ["js", "variation", "css", "html"]
      };

      await TestUtils.createGenerator({ prompts: testPrompts });

      // Assert file creation
      const testFiles = [
        ...TestUtils.getVariationPaths({ type: 'js', count: 4 }),
        ...TestUtils.getVariationPaths({ type: 'css', count: 4 }),
        ...TestUtils.getVariationPaths({ type: 'html', count: 4 })
      ];

      assert.file(testFiles);

      // Assert no control files
      const controlFiles = [
        TestUtils.getFilePath("_tests/Test-123/src/html/control.html"),
        TestUtils.getFilePath("_tests/Test-123/src/css/control.css"),
        TestUtils.getFilePath("_tests/Test-123/src/js/control.js")
      ];

      assert.noFile(controlFiles);
      assert.noFile(TestUtils.getFilePath("_tests/Test-123/src/readme.md"));
    });

    it("should generate control files when requested", async () => {
      const testPrompts = {
        ...mockPrompts,
        filesToGenerate: ["js", "control", "css", "html"]
      };

      await TestUtils.createGenerator({ prompts: testPrompts });

      const controlFiles = [
        TestUtils.getFilePath("_tests/Test-123/src/js/control.js"),
        TestUtils.getFilePath("_tests/Test-123/src/css/control.css"),
        TestUtils.getFilePath("_tests/Test-123/src/html/control.html")
      ];

      assert.file(controlFiles);
    });

    it("should generate single file type when specified", async () => {
      const testPrompts = {
        ...mockPrompts,
        filesToGenerate: ["readme"]
      };

      await TestUtils.createGenerator({ prompts: testPrompts });

      assert.file(TestUtils.getFilePath("_tests/Test-123/src/readme.md"));
      assert.noFile(TestUtils.getVariationPaths({ type: 'js', count: 4 }));
      assert.noFile(TestUtils.getVariationPaths({ type: 'css', count: 4 }));
      assert.noFile(TestUtils.getVariationPaths({ type: 'html', count: 4 }));
    });

    it("should respect child folder structure", async () => {
      const testPrompts = {
        ...mockPrompts,
        childFolder: "testChildFolder",
        filesToGenerate: ["readme"]
      };

      await TestUtils.createGenerator({ prompts: testPrompts });

      assert.file(TestUtils.getFilePath("_tests/testChildFolder/Test-123/src/readme.md"));
      assert.noFile(TestUtils.getFilePath("_tests/Test-123/src/readme.md"));
    });
  });

  describe("Custom Templates", () => {
    beforeEach(() => {
      mockConfig.templates.customDirectory = "../test_custom_templates";
    });

    it("should use custom template with correct content", async () => {
      const testPrompts = {
        ...mockPrompts,
        customTemplate: "custom-1",
        filesToGenerate: ["variation", "js", "control", "css", "html", "readme"]
      };

      await TestUtils.createGenerator({ prompts: testPrompts });

      // Test variation files
      const variationFiles = [
        ...TestUtils.getVariationPaths({ type: 'js', count: 4 }),
        ...TestUtils.getVariationPaths({ type: 'css', count: 4 }),
        ...TestUtils.getVariationPaths({ type: 'html', count: 4 })
      ];

      variationFiles.forEach(file => {
        TestUtils.assertFileContent(file, TEST_CONSTANTS.CUSTOM_TEMPLATE_CONTENT);
      });

      // Test control files
      const controlFiles = [
        TestUtils.getFilePath("_tests/Test-123/src/html/control.html"),
        TestUtils.getFilePath("_tests/Test-123/src/css/control.css"),
        TestUtils.getFilePath("_tests/Test-123/src/js/control.js")
      ];

      controlFiles.forEach(file => {
        TestUtils.assertFileContent(file, TEST_CONSTANTS.CUSTOM_TEMPLATE_CONTENT);
      });

      // Test readme
      TestUtils.assertFileContent(
        TestUtils.getFilePath("_tests/Test-123/src/readme.md"),
        TEST_CONSTANTS.CUSTOM_TEMPLATE_CONTENT
      );
    });
  });

  // Continue with other test sections...
  // The pattern continues for Optimizely tests, variable tests, etc.
});