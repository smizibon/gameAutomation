import { Given, When, Then } from "@cucumber/cucumber";
import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";
import GamePage from "../page_objects/GamePage.js";

// Declare gamePage variable at the top level
let gamePage;

/**
 * Step definitions for game testing
 */

Given("I am on the Flarie game website", async function () {
  try {
    // Initialize GamePage with the driver from hooks
    gamePage = new GamePage(this.driver);
    await this.driver.get(
      "https://game.flarie.com/games/trails/cb5554e1-cf85-4a19-a1d2-3571db42398f"
    );
  } catch (error) {
    console.error("Error in Given step:", error);
    throw error;
  }
});

When("the page loads completely", async function () {
  try {
    // Wait for the canvas element to be present
    await this.driver.wait(until.elementLocated(By.css("canvas")), 10000);
  } catch (error) {
    console.error("Error in When step:", error);
    throw error;
  }
});

Then("I should see the game interface", async function () {
  try {
    // Use the GamePage object to check if canvas is displayed
    const isDisplayed = await gamePage.isCanvasDisplayed();
    expect(isDisplayed).to.be.true;
  } catch (error) {
    console.error("Error in Then step:", error);
    throw error;
  }
});
