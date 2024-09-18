/*
 ** Developer: <%= developer %>
 ** Date: <%= date %>
 ** Test: <%= testName %>
 ** Variation: Shared
 ** Description: <%= testDescription %>
 */

/**
 * Optimizely IDs
 */

const experimentId = "<%= optimizely.experimentId %>",
  variationId = "<%= optimizely.variationId %>";

const utils = window["optimizely"].get("utils");

// Add a CSS selector of the element
utils.waitForElement("").then(function (element) {
  try {
    // Add your code here...
  } catch (error) {
    console.log(error);
  }
});
