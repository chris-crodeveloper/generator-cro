/*
 ** CUSTOM TEMPLATE 1
 ** Developer: <%= developer %>
 ** Date: <%= date %>
 ** Test: <%= testName %>
 ** Variation: <%=  variations.currentVariation.name %>
 ** Description: <%= testDescription %>
 */

/**
 * Optimizely IDs
 */

const experimentId = "<%= optimizely.experimentId %>",
  variationId = "<%= variations.currentVariation.id %>",
  variationName = "<%=  variations.currentVariation.name %>",
  testId = "<%= testId %>";

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
