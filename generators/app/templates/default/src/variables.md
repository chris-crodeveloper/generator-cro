# Template Variables Documentation

This document lists all available template variables for use in your templates.

## Basic Variables
- `testId`: Test identifier used for namespacing
- `testName`: Full test name
- `testDescription`: Test description
- `testUrl`: URL where the test will run
- `date`: Current date in DD/MM/YYYY format
- `developer`: Developer name
- `customTemplate`: Selected template name

## Test Configuration
- `testDetails`: Link to test details (JIRA, Trello, etc.)
- `variationCount`: Number of variations (excluding control)
- `childFolder`: Selected test area (if applicable)
- `filesToGenerate`: List of files to be generated

## File Paths
- `destinationPath`: Source file destination path
- `css.shared`: Path to shared CSS file
- `css.control`: Path to control CSS file
- `css.variation`: Path to variation CSS files
- `js.shared`: Path to shared JavaScript file
- `js.control`: Path to control JavaScript file
- `js.variation`: Path to variation JavaScript files

## Optimizely Integration
- `optimizely.experimentId`: Optimizely experiment ID
- `optimizely.project_name`: Optimizely project name
- `optimizely.testType`: Type of Optimizely test
- `optimizely.requestType`: API request type (GET/POST)

## Variation Data
- `variationData`: Array of variation information
  - `variationName`: Name of each variation
  - `variationId`: Optimizely variation ID

## Dynamic Variables
These variables are available during variation file generation:

- `variations.currentVariation.index`: Current variation number
- `variations.currentVariation.name`: Variation name
- `variations.currentVariation.filename`: Generated filename
- `variations.currentVariation.id`: Variation ID (if using Optimizely)

## Usage Examples

You can use these variables in your templates using the EJS syntax:

```ejs
// Basic variable
<%= testName %>

// Nested variable
<%= optimizely.experimentId %>

// Conditional logic
<% if (variations.currentVariation.index === 1) { %>
  // First variation specific code
<% } %>

// Loops
<% for(let i = 1; i <= variationCount; i++) { %>
  // Variation <%= i %> code
<% } %>
```

## Notes

- All variables are available in standard template files
- Variation-specific variables are only available during variation file generation
- Use proper error handling when working with optional variables
- Variables may be empty strings if not provided during generation
- All paths are normalized to use forward slashes for cross-platform compatibility