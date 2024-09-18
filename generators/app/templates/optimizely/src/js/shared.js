/*
 ** Developer: <%= developer %>
 ** Date: <%= date %>
 ** Test: <%= testName %>
 ** Variation: Shared
 ** Description: <%= testDescription %>
 */


 const testId = "<%= testId %>";

 const waitForElement = (element, callback) => {
  const maxCalls = 50,
    delay = 500;
  let count = 0;
  const interval = setInterval(() => {
    try {
      const el = document.querySelector(element);

      if (el) {
        clearInterval(interval);

        callback(el);
      }

      // After trying to find the element for 6 seconds, it stops
      if (count > maxCalls) clearInterval(interval);

      // increment interval count
      count++;
    } catch (error) {
      console.error(error);
    }
  }, delay);
};

// Add a CSS selector of the element
waitForElement("", function (element) {
  try {
    // Add namespace to body
    document.documentElement.classList.add(testId);

    // Add your code here...
  } catch (error) {
    console.log(error);
  }
});