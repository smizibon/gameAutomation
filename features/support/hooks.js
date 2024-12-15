import { Before, After, Status } from "@cucumber/cucumber";
import { Builder } from "selenium-webdriver";

let passedScenarios = [];
let driver;

After(async function (scenario) {
  try {
    if (scenario.result.status === Status.FAILED) {
      try {
        const screenshot = await this.driver.takeScreenshot();
        this.attach(screenshot, "image/png");
      } catch (screenshotError) {
        console.error("Failed to take screenshot:", screenshotError);
      }
    } else if (scenario.result.status === Status.PASSED) {
      passedScenarios.push({
        name: scenario.pickle.name,
        feature: scenario.gherkinDocument.feature.name,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error in After hook:", error);
  } finally {
    if (this.driver) {
      try {
        await this.driver.quit();
      } catch (quitError) {
        console.error("Error while quitting driver:", quitError);
      }
    }
  }
});

process.on("exit", () => {
  console.log("\n=== Test Execution Summary ===");
  console.log(`Total Passed Scenarios: ${passedScenarios.length}`);
  console.log("\nPassed Scenarios Details:");
  passedScenarios.forEach((scenario, index) => {
    console.log(`\n#${index + 1}`);
    console.log(`Feature: ${scenario.feature}`);
    console.log(`Scenario: ${scenario.name}`);
    console.log(`Executed at: ${scenario.timestamp}`);
    console.log("----------------------------------------");
  });
});

Before(async function () {
  try {
    this.driver = await new Builder().forBrowser("chrome").build();
  } catch (error) {
    console.error("Error creating WebDriver:", error);
    throw error;
  }
});