import { Before, After, Status } from "@cucumber/cucumber";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Set path for ChromeDriver
const driverPath = join(__dirname, "../../drivers/chromedriver");

// Store scenarios results for reporting
let passedScenarios = [];
let failedScenarios = [];
let driver;

/**
 * Before hook - runs before each scenario
 * Sets up the WebDriver instance with ChromeDriver
 */
Before(async function () {
  try {
    // Initialize ChromeDriver service with local driver
    const service = new chrome.ServiceBuilder(driverPath);
    // Build WebDriver instance
    this.driver = await new Builder()
      .forBrowser("chrome")
      .setChromeService(service)
      .build();
  } catch (error) {
    console.error("Error creating WebDriver:", error);
    throw error;
  }
});

/**
 * After hook - runs after each scenario
 * Handles test results and cleanup
 */
After(async function (scenario) {
  try {
    if (scenario.result.status === Status.FAILED) {
      try {
        // Take screenshot on failure
        const screenshot = await this.driver.takeScreenshot();
        this.attach(screenshot, "image/png");
        // Store failed scenario details
        failedScenarios.push({
          name: scenario.pickle.name,
          feature: scenario.gherkinDocument.feature.name,
          timestamp: new Date().toISOString(),
          error: scenario.result.message,
        });
      } catch (screenshotError) {
        console.error("Failed to take screenshot:", screenshotError);
      }
    } else if (scenario.result.status === Status.PASSED) {
      // Store passed scenario details
      passedScenarios.push({
        name: scenario.pickle.name,
        feature: scenario.gherkinDocument.feature.name,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error in After hook:", error);
  } finally {
    // Ensure WebDriver is closed properly
    if (this.driver) {
      try {
        await this.driver.quit();
      } catch (quitError) {
        console.error("Error while quitting driver:", quitError);
      }
    }
  }
});

/**
 * Process exit handler
 * Prints detailed test execution summary before process ends
 */
process.on("exit", () => {
  console.log("\n=== Test Execution Summary ===");
  console.log(
    `Total Scenarios: ${passedScenarios.length + failedScenarios.length}`
  );
  console.log(`Passed: ${passedScenarios.length}`);
  console.log(`Failed: ${failedScenarios.length}`);

  if (passedScenarios.length > 0) {
    console.log("\n✅✅✅ PASSED SCENARIOS:");
    passedScenarios.forEach((scenario, index) => {
      console.log(`\n#${index + 1}`);
      console.log(`Feature: ${scenario.feature}`);
      console.log(`Scenario: ${scenario.name}`);
      console.log(`Executed at: ${scenario.timestamp}`);
      console.log("----------------------------------------");
    });
  }

  if (failedScenarios.length > 0) {
    console.log("\n❌❌❌ FAILED SCENARIOS:");
    failedScenarios.forEach((scenario, index) => {
      console.log(`\n#${index + 1}`);
      console.log(`Feature: ${scenario.feature}`);
      console.log(`Scenario: ${scenario.name}`);
      console.log(`Executed at: ${scenario.timestamp}`);
      console.log(`Error: ${scenario.error}`);
      console.log("----------------------------------------");
    });
  }
});
