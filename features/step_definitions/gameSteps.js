import { Given, When, Then } from "@cucumber/cucumber";
import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";
import GamePage from "../page_objects/GamePage.js";

let driver;
let gamePage;

Given("I am on the Flarie game website", async function () {
  driver = await new Builder().forBrowser("chrome").build();
  await driver.get(
    "https://game.flarie.com/games/trails/cb5554e1-cf85-4a19-a1d2-3571db42398f"
  );
  gamePage = new GamePage(driver);
});

When("the page loads completely", async function () {
  // Wait for the page to load completely
  await driver.wait(until.elementLocated(gamePage.canvasSelector), 10000);
});

Then("I should see the game interface", async function () {
  // Verify the game canvas is present
  expect(await gamePage.isCanvasDisplayed()).to.be.true;

  // Clean up
  await driver.quit();
});
