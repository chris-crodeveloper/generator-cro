import helpers, { result } from "yeoman-test";
import assert from "yeoman-assert";
import path from "path";
import { fileURLToPath } from "url";
import mockConfig from "./mockConfig.js";
import mockPrompts from "./mockPrompts.js";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "temp");

// Setup test output directory
let updatedMockConfig = mockConfig;

// Test Suite
describe("Generator Tests ", () => {
  // Correct Files are created
  describe("Files creation", () => {
    it("Correct number of variation files are generated", function () {
      // The object returned acts like a promise, so return it to wait until the process is done

      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.variations = "4";
      updatedMockPrompts.filesToGenerate = ["js", "variation", "css", "html"];

      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          // JS variation files
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/js/variation-1.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-2.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-3.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-4.js"),
          ]);

          // CSS variation files
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/css/variation-1.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-2.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-3.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-4.css"),
          ]);

          // HTML variation files
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/html/variation-1.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-2.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-3.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-4.html"),
          ]);

          // No control files created
          assert.noFile([
            path.join(tempDir, "_tests/Test-123/src/html/control.html"),
            path.join(tempDir, "_tests/Test-123/src/css/control.css"),
            path.join(tempDir, "_tests/Test-123/src/js/control.js"),
          ]);

          // Readme not created
          assert.noFile([path.join(tempDir, "_tests/Test-123/src/readme.md")]);
        });
    });

    it("Control files are generated", function () {
      // The object returned acts like a promise, so return it to wait until the process is done

      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.filesToGenerate = ["js", "control", "css", "html"];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          // assert something about the generator
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/js/control.js"),
          ]);
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/css/control.css"),
          ]);
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/html/control.html"),
          ]);
        });
    });

    it("Single file type is created only", function () {
      // The object returned acts like a promise, so return it to wait until the process is done

      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.filesToGenerate = ["readme"];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          // assert something about the generator
          assert.file([path.join(tempDir, "_tests/Test-123/src/readme.md")]);

          assert.noFile([
            path.join(tempDir, "_tests/Test-123/src/js/variation-1.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-2.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-3.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-4.js"),
          ]);

          // CSS variation noFiles
          assert.noFile([
            path.join(tempDir, "_tests/Test-123/src/css/variation-1.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-2.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-3.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-4.css"),
          ]);

          // HTML variation files
          assert.noFile([
            path.join(tempDir, "_tests/Test-123/src/html/variation-1.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-2.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-3.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-4.html"),
          ]);
        });
    });

    it("Child folders are added to the path", function () {
      // The object returned acts like a promise, so return it to wait until the process is done

      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.childFolder = "testChildFolder";
      updatedMockPrompts.filesToGenerate = ["readme"];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          // assert something about the generator
          assert.file([
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/readme.md"),
          ]);
          assert.noFile([path.join(tempDir, "_tests/Test-123/src/readme.md")]);
        });
    });
  });

  // Custom templates are used
  describe("Custom templates", () => {
    it("Custom template folder used and templates generated - with correct contents", function () {
      updatedMockConfig.templates.customDirectory = "../test_custom_templates";

      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.childFolder = "";
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = [
        "variation",
        "js",
        "control",
        "css",
        "html",
        "readme",
      ];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          // JS variation files
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/js/variation-1.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-2.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-3.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-4.js"),
          ]);

          // Confirm file contents
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/variation-1.js"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/variation-2.js"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/variation-3.js"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/variation-4.js"),
            "CUSTOM TEMPLATE 1"
          );

          // CSS variation files
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/css/variation-1.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-2.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-3.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-4.css"),
          ]);

          // Confirm file contents
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/variation-1.css"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/variation-2.css"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/variation-3.css"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/variation-4.css"),
            "CUSTOM TEMPLATE 1"
          );

          // HTML variation files
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/html/variation-1.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-2.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-3.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-4.html"),
          ]);

          // Confirm file contents
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/variation-1.html"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/variation-2.html"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/variation-3.html"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/variation-4.html"),
            "CUSTOM TEMPLATE 1"
          );

          // Control files created
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/html/control.html"),
            path.join(tempDir, "_tests/Test-123/src/css/control.css"),
            path.join(tempDir, "_tests/Test-123/src/js/control.js"),
          ]);

          // Confirm file contents
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/control.html"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/control.css"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/control.js"),
            "CUSTOM TEMPLATE 1"
          );

          // Readme  created
          assert.file([path.join(tempDir, "_tests/Test-123/src/readme.md")]);

          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/readme.md"),
            "CUSTOM TEMPLATE 1"
          );
        });
    });

    it("Custom template file contents copied - with correct contents", function () {
      updatedMockConfig.templates.customDirectory = "../test_custom_templates";

      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.childFolder = "";
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = [
        "variation",
        "js",
        "control",
        "css",
        "html",
        "readme",
      ];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          // JS variation files
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/js/variation-1.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-2.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-3.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-4.js"),
          ]);

          // Confirm file contents
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/variation-1.js"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/variation-2.js"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/variation-3.js"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/variation-4.js"),
            "CUSTOM TEMPLATE 1"
          );

          // CSS variation files
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/css/variation-1.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-2.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-3.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-4.css"),
          ]);

          // Confirm file contents
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/variation-1.css"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/variation-2.css"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/variation-3.css"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/variation-4.css"),
            "CUSTOM TEMPLATE 1"
          );

          // HTML variation files
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/html/variation-1.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-2.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-3.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-4.html"),
          ]);

          // Confirm file contents
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/variation-1.html"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/variation-2.html"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/variation-3.html"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/variation-4.html"),
            "CUSTOM TEMPLATE 1"
          );

          // Control files created
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/html/control.html"),
            path.join(tempDir, "_tests/Test-123/src/css/control.css"),
            path.join(tempDir, "_tests/Test-123/src/js/control.js"),
          ]);

          // Confirm file contents
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/control.html"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/control.css"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/control.js"),
            "CUSTOM TEMPLATE 1"
          );

          // Readme  created
          assert.file([path.join(tempDir, "_tests/Test-123/src/readme.md")]);

          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/readme.md"),
            "CUSTOM TEMPLATE 1"
          );
        });
    });

    it("Custom template control files generated - with correct contents", function () {
      updatedMockConfig.templates.customDirectory = "../test_custom_templates";

      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.childFolder = "";
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = ["js", "control", "css", "html"];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          // assert something about the generator
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/js/control.js"),
          ]);
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/css/control.css"),
          ]);
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/html/control.html"),
          ]);

          // Confirm file contents
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/html/control.html"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/css/control.css"),
            "CUSTOM TEMPLATE 1"
          );
          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/js/control.js"),
            "CUSTOM TEMPLATE 1"
          );
        });
    });

    it("Custom template single files type is created only - with correct contents", function () {
      // The object returned acts like a promise, so return it to wait until the process is done

      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.filesToGenerate = ["readme"];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          // assert something about the generator
          assert.file([path.join(tempDir, "_tests/Test-123/src/readme.md")]);

          assert.fileContent(
            path.join(tempDir, "_tests/Test-123/src/readme.md"),
            "CUSTOM TEMPLATE 1"
          );

          assert.noFile([
            path.join(tempDir, "_tests/Test-123/src/js/variation-1.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-2.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-3.js"),
            path.join(tempDir, "_tests/Test-123/src/js/variation-4.js"),
          ]);

          // CSS variation noFiles
          assert.noFile([
            path.join(tempDir, "_tests/Test-123/src/css/variation-1.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-2.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-3.css"),
            path.join(tempDir, "_tests/Test-123/src/css/variation-4.css"),
          ]);

          // HTML variation files
          assert.noFile([
            path.join(tempDir, "_tests/Test-123/src/html/variation-1.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-2.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-3.html"),
            path.join(tempDir, "_tests/Test-123/src/html/variation-4.html"),
          ]);
        });
    });
  });

  // Custom files are added to prompt
  describe("Custom files", () => {
    it("Create custom variation files", () => {
      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = [
        "variation",
        "control",
        "scss",
        "tampermonkey",
      ];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          assert.file([
            path.join(tempDir, "_tests/Test-123/src/scss/variation-1.scss"),
            path.join(tempDir, "_tests/Test-123/src/scss/variation-2.scss"),
            path.join(tempDir, "_tests/Test-123/src/scss/variation-3.scss"),
            path.join(tempDir, "_tests/Test-123/src/scss/variation-4.scss"),
          ]);

          assert.file([
            path.join(
              tempDir,
              "_tests/Test-123/src/tampermonkey/variation-1.js"
            ),
            path.join(
              tempDir,
              "_tests/Test-123/src/tampermonkey/variation-2.js"
            ),
            path.join(
              tempDir,
              "_tests/Test-123/src/tampermonkey/variation-3.js"
            ),
            path.join(
              tempDir,
              "_tests/Test-123/src/tampermonkey/variation-4.js"
            ),
          ]);
        });
    });

    it("Create custom single files", () => {
      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = ["cypress"];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function () {
          assert.file([path.join(tempDir, "_tests/Test-123/src/cypress.js")]);
        });
    });
  });

  // Custom files are added to prompt
  describe("Variation variables set correctly", () => {
    it("Common variables are set", () => {
      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.childFolder = "testChildFolder";
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = [
        "control",
        "variation",
        "shared",
        "js",
        "css",
        "readme",
      ];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function (generator) {
          const templateVariables =
            generator.options.generator.templateVariables;
          assert.strictEqual(templateVariables.testDetails, "My First Test");
          assert.strictEqual(templateVariables.testId, "Test-123");
          assert.strictEqual(
            templateVariables.testName,
            "Test 123 - My First Test"
          );
          assert.strictEqual(
            templateVariables.testDescription,
            "My First Test - created using Optimizely Generator"
          );
          assert.strictEqual(templateVariables.childFolder, "testChildFolder");
          assert.deepEqual(templateVariables.filesToGenerate, [
            "control",
            "variation",
            "shared",
            "js",
            "css",
            "readme",
          ]);
          assert.strictEqual(templateVariables.developer, "Chris");
        });
    });

    it("Filepaths are set", () => {
      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.childFolder = "testChildFolder";
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = [
        "control",
        "variation",
        "shared",
        "js",
        "css",
        "html",
        "readme",
      ];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function (generator) {
          const templateVariables =
            generator.options.generator.templateVariables;
          assert.strictEqual(
            templateVariables.js.shared,
            path.join(
              tempDir,
              "_tests/testChildFolder/Test-123/dist/js/shared.js"
            )
          );
          assert.strictEqual(
            templateVariables.js.control,
            path.join(
              tempDir,
              "_tests/testChildFolder/Test-123/dist/js/control.js"
            )
          );
          assert.strictEqual(
            templateVariables.js.variation,
            path.join(tempDir, "_tests/testChildFolder/Test-123/dist/js/")
          );
          assert.strictEqual(
            templateVariables.css.shared,
            path.join(
              tempDir,
              "_tests/testChildFolder/Test-123/dist/css/shared.css"
            )
          );
          assert.strictEqual(
            templateVariables.css.control,
            path.join(
              tempDir,
              "_tests/testChildFolder/Test-123/dist/css/control.css"
            )
          );
          assert.strictEqual(
            templateVariables.css.variation,
            path.join(tempDir, "_tests/testChildFolder/Test-123/dist/css/")
          );
          assert.strictEqual(
            templateVariables.html.shared,
            path.join(
              tempDir,
              "_tests/testChildFolder/Test-123/dist/html/shared.html"
            )
          );
          assert.strictEqual(
            templateVariables.html.control,
            path.join(
              tempDir,
              "_tests/testChildFolder/Test-123/dist/html/control.html"
            )
          );
          assert.strictEqual(
            templateVariables.html.variation,
            path.join(tempDir, "_tests/testChildFolder/Test-123/dist/html/")
          );
        });
    });

    it("Server paths are set", () => {
      mockConfig.output.localhost = "http://localhost:3000";
      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.childFolder = "testChildFolder";
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = [
        "control",
        "variation",
        "shared",
        "js",
        "css",
        "html",
        "readme",
      ];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function (generator) {
          const templateVariables =
            generator.options.generator.templateVariables;
          assert.strictEqual(
            templateVariables.js.server.shared,
            "http://localhost:3000/_tests/testChildFolder/Test-123/dist/js/shared.js"
          );
          assert.strictEqual(
            templateVariables.js.server.control,
            "http://localhost:3000/_tests/testChildFolder/Test-123/dist/js/control.js"
          );
          assert.strictEqual(
            templateVariables.js.server.variation,
            "http://localhost:3000/_tests/testChildFolder/Test-123/dist/js/"
          );
          assert.strictEqual(
            templateVariables.css.server.shared,
            "http://localhost:3000/_tests/testChildFolder/Test-123/dist/css/shared.css"
          );
          assert.strictEqual(
            templateVariables.css.server.control,
            "http://localhost:3000/_tests/testChildFolder/Test-123/dist/css/control.css"
          );
          assert.strictEqual(
            templateVariables.css.server.variation,
            "http://localhost:3000/_tests/testChildFolder/Test-123/dist/css/"
          );
          assert.strictEqual(
            templateVariables.html.server.shared,
            "http://localhost:3000/_tests/testChildFolder/Test-123/dist/html/shared.html"
          );
          assert.strictEqual(
            templateVariables.html.server.control,
            "http://localhost:3000/_tests/testChildFolder/Test-123/dist/html/control.html"
          );
          assert.strictEqual(
            templateVariables.html.server.variation,
            "http://localhost:3000/_tests/testChildFolder/Test-123/dist/html/"
          );
        });
    });
  });

   // Custom files are added to prompt
   describe("Optimizely", () => {
    it("Files generated when Optimizely config exists", () => {
      updatedMockConfig.optimizely.projects = [{
        project_name: 'Staging',
        auth_token: 'test',
        project_id: 12345678901,
        audiences: {
          "qa=true" : 12345678901
        },
        default: true
      }, {
        project_name: 'Prod',
        auth_token: 'test',
        project_id: 12345678901,
        audiences: {
          "qa=true" : 12345678901
        },
      }];
      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.childFolder = "testChildFolder";
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = [
        "variation",
        "shared",
        "js",
        "css",
        "readme",
        "html"
      ];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function (generator) {
          const templateVariables =
            generator.options.generator.templateVariables;

               // JS variation files
          assert.file([
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/variation-1.js"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/variation-2.js"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/variation-3.js"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/variation-4.js"),
          ]);

          // CSS variation files
          assert.file([
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/variation-1.css"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/variation-2.css"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/variation-3.css"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/variation-4.css"),
          ]);

          // HTML variation files
          assert.file([
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/variation-1.html"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/variation-2.html"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/variation-3.html"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/variation-4.html"),
          ]);


          // Readme  created
          assert.file([path.join(tempDir, "_tests/testChildFolder/Test-123/src/readme.md")]);

          // No control files created
          assert.noFile([
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/control.html"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/control.css"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/control.js"),
          ]);

          assert.strictEqual(templateVariables.testDetails, "My First Test");
          assert.strictEqual(templateVariables.testId, "Test-123");
          assert.strictEqual(
            templateVariables.testName,
            "Test 123 - My First Test"
          );
          assert.strictEqual(
            templateVariables.testDescription,
            "My First Test - created using Optimizely Generator"
          );
          assert.strictEqual(templateVariables.childFolder, "testChildFolder");
          assert.deepEqual(templateVariables.filesToGenerate, [
            "variation",
            "shared",
            "js",
            "css",
            "readme",
            "html"
          ]);
          assert.strictEqual(templateVariables.developer, "Chris");
        });
    });
    it("Files generated with single Optimizely project config", () => {
      updatedMockConfig.optimizely.projects = [{
        project_name: 'Staging',
        auth_token: 'test',
        project_id: 12345678901,
        audiences: {
          "qa=true" : 12345678901
        },
        default: true
      }];
      let updatedMockPrompts = mockPrompts;
      updatedMockPrompts.childFolder = "testChildFolder";
      updatedMockPrompts.customTemplate = "custom-1";
      updatedMockPrompts.filesToGenerate = [
        "variation",
        "shared",
        "js",
        "css",
        "readme",
        "html"
      ];
      return helpers
        .run(path.join(__dirname, "../generators/app"))
        .withPrompts(updatedMockPrompts)
        .inDir(tempDir)
        .withOptions({ updatedMockConfig })
        .then(function (generator) {
          const templateVariables =
            generator.options.generator.templateVariables;

               // JS variation files
          assert.file([
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/variation-1.js"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/variation-2.js"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/variation-3.js"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/variation-4.js"),
          ]);

          // CSS variation files
          assert.file([
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/variation-1.css"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/variation-2.css"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/variation-3.css"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/variation-4.css"),
          ]);

          // HTML variation files
          assert.file([
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/variation-1.html"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/variation-2.html"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/variation-3.html"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/variation-4.html"),
          ]);


          // Readme  created
          assert.file([path.join(tempDir, "_tests/testChildFolder/Test-123/src/readme.md")]);

          // No control files created
          assert.noFile([
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/html/control.html"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/css/control.css"),
            path.join(tempDir, "_tests/testChildFolder/Test-123/src/js/control.js"),
          ]);

          assert.strictEqual(templateVariables.testDetails, "My First Test");
          assert.strictEqual(templateVariables.testId, "Test-123");
          assert.strictEqual(
            templateVariables.testName,
            "Test 123 - My First Test"
          );
          assert.strictEqual(
            templateVariables.testDescription,
            "My First Test - created using Optimizely Generator"
          );
          assert.strictEqual(templateVariables.childFolder, "testChildFolder");
          assert.deepEqual(templateVariables.filesToGenerate, [
            "variation",
            "shared",
            "js",
            "css",
            "readme",
            "html"
          ]);
          assert.strictEqual(templateVariables.developer, "Chris");
        });
    });

  
   
  });
  
    // Custom files are added to prompt
    describe("Defaults", () => {
   
      it("Default custom templates used", function () {
        updatedMockConfig.templates.customDirectory = "../test_custom_templates";
  
        updatedMockConfig.templates.defaultCustomTemplate = "custom-1"
        let updatedMockPrompts = mockPrompts;
        updatedMockPrompts.childFolder = "";
        updatedMockPrompts.useDefaultCustomTemplate = true;
        updatedMockPrompts.filesToGenerate = [
          "variation",
          "js",
          "control",
          "css",
          "html",
          "readme",
        ];
        return helpers
          .run(path.join(__dirname, "../generators/app"))
          .withPrompts(updatedMockPrompts)
          .inDir(tempDir)
          .withOptions({ updatedMockConfig })
          .then(function () {
            // JS variation files
            assert.file([
              path.join(tempDir, "_tests/Test-123/src/js/variation-1.js"),
              path.join(tempDir, "_tests/Test-123/src/js/variation-2.js"),
              path.join(tempDir, "_tests/Test-123/src/js/variation-3.js"),
              path.join(tempDir, "_tests/Test-123/src/js/variation-4.js"),
            ]);
  
            // Confirm file contents
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/js/variation-1.js"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/js/variation-2.js"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/js/variation-3.js"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/js/variation-4.js"),
              "CUSTOM TEMPLATE 1"
            );
  
            // CSS variation files
            assert.file([
              path.join(tempDir, "_tests/Test-123/src/css/variation-1.css"),
              path.join(tempDir, "_tests/Test-123/src/css/variation-2.css"),
              path.join(tempDir, "_tests/Test-123/src/css/variation-3.css"),
              path.join(tempDir, "_tests/Test-123/src/css/variation-4.css"),
            ]);
  
            // Confirm file contents
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/css/variation-1.css"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/css/variation-2.css"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/css/variation-3.css"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/css/variation-4.css"),
              "CUSTOM TEMPLATE 1"
            );
  
            // HTML variation files
            assert.file([
              path.join(tempDir, "_tests/Test-123/src/html/variation-1.html"),
              path.join(tempDir, "_tests/Test-123/src/html/variation-2.html"),
              path.join(tempDir, "_tests/Test-123/src/html/variation-3.html"),
              path.join(tempDir, "_tests/Test-123/src/html/variation-4.html"),
            ]);
  
            // Confirm file contents
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/html/variation-1.html"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/html/variation-2.html"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/html/variation-3.html"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/html/variation-4.html"),
              "CUSTOM TEMPLATE 1"
            );
  
            // Control files created
            assert.file([
              path.join(tempDir, "_tests/Test-123/src/html/control.html"),
              path.join(tempDir, "_tests/Test-123/src/css/control.css"),
              path.join(tempDir, "_tests/Test-123/src/js/control.js"),
            ]);
  
            // Confirm file contents
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/html/control.html"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/css/control.css"),
              "CUSTOM TEMPLATE 1"
            );
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/js/control.js"),
              "CUSTOM TEMPLATE 1"
            );
  
            // Readme  created
            assert.file([path.join(tempDir, "_tests/Test-123/src/readme.md")]);
  
            assert.fileContent(
              path.join(tempDir, "_tests/Test-123/src/readme.md"),
              "CUSTOM TEMPLATE 1"
            );
          });
      });
  
    
     
    });

});
