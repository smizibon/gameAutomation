import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import GamePage from "../page_objects/GamePage.js";

let gamePage;

Given("I am on the Flarie game website", async function () {
  try {
    gamePage = new GamePage(this.driver);
    await this.driver.get(
      "https://game.flarie.com/games/trails/cb5554e1-cf85-4a19-a1d2-3571db42398f"
    );
    await this.driver.manage().window().maximize();
  } catch (error) {
    console.error("Error in Given step:", error);
    throw error;
  }
});

When("the page loads completely", { timeout: 60000 }, async function () {
  try {
    const loadingResults = await gamePage.checkAllElementsLoaded();
    this.loadingResults = loadingResults;
  } catch (error) {
    console.error("Error in When step:", error);
    throw error;
  }
});

Then("I should see the game interface", async function () {
  try {
    expect(
      this.loadingResults.success,
      "Not all basic elements loaded successfully"
    ).to.be.true;

    console.log("\nBasic elements loaded successfully:");
    this.loadingResults.loadedElements.forEach((element) => {
      console.log(`✓ ${element}`);
    });

    if (this.loadingResults.missingElements.length > 0) {
      console.log("\nMissing basic elements:");
      this.loadingResults.missingElements.forEach((element) => {
        console.log(`✗ ${element}`);
      });
    }

    console.log("\nData-testid elements found:");
    if (this.loadingResults.dataTestIdElements.length > 0) {
      this.loadingResults.dataTestIdElements.forEach((item, index) => {
        console.log(
          `${index + 1}. data-testid="${item.testId}" (${
            item.isVisible ? "visible" : "not visible"
          })`
        );
      });
    } else {
      console.log("No elements with data-testid attribute found");
    }
  } catch (error) {
    console.error("Error in Then step:", error);
    throw error;
  }
});
