/*
 ** CUSTOM TEMPLATE 1
 ** Developer: Chris
 ** Date: 05/03/2024
 ** Test: Test 123 - My First Test
 ** Variation: Variation #4
 ** Description: My First Test - created using Optimizely Generator
 */

/**
 * Optimizely IDs
 */

const experimentId = "",
  variationId = "",
  variationName = "Variation #4",
  testId = "Test-123";

const utils = window["optimizely"].get("utils");

// Add a CSS selector of the element
utils.waitForElement("").then(function (element) {
  try {
    // Add namespace to body
    document.documentElement.classList.add(testId);

    // Add your code here...
  } catch (error) {
    console.log(error);
  }
});
