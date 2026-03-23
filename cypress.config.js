const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)]
    })
  );

  return config;
}

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.DOG_API_BASE_URL || "https://dog.ceo/api",
    specPattern: "cypress/e2e/feature/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents
  },
  env: {
    defaultBreed: process.env.DOG_API_BREED || "hound"
  },
  requestTimeout: Number(process.env.DOG_API_TIMEOUT || 15000),
  responseTimeout: Number(process.env.DOG_API_TIMEOUT || 15000),
  video: false,
  screenshotOnRunFailure: true,
  screenshotsFolder: "reports/screenshots",
  downloadsFolder: "reports/downloads"
});