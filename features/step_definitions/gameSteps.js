import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import GamePage from "../page_objects/GamePage.js";
import { until } from "selenium-webdriver";
import { By } from "selenium-webdriver";

let gamePage;

// Step definition for navigating to the Flarie game website
Given("I am on the Flarie game website", async function () {
  try {
    // Initialize the GamePage object with the WebDriver instance
    gamePage = new GamePage(this.driver);
    // Navigate to the specified URL
    await this.driver.get(
      "https://game.flarie.com/games/trails/cb5554e1-cf85-4a19-a1d2-3571db42398f"
    );
    // Maximize the browser window
    await this.driver.manage().window().maximize();
  } catch (error) {
    // Log and rethrow any errors encountered
    console.error("Error in Given step:", error);
    throw error;
  }
});

// Step definition for checking if the page has loaded completely
When("the page loads completely", { timeout: 60000 }, async function () {
  try {
    // Check if all elements on the page are loaded
    const loadingResults = await gamePage.checkAllElementsLoaded();
    // Store the loading results in the context
    this.loadingResults = loadingResults;
  } catch (error) {
    // Log and rethrow any errors encountered
    console.error("Error in When step:", error);
    throw error;
  }
});

// Step definition for verifying the game interface is visible
Then("I should see the game interface", async function () {
  try {
    // Assert that all basic elements are loaded successfully
    expect(
      this.loadingResults.success,
      "Not all basic elements loaded successfully"
    ).to.be.true;

    // Commented out: Log the successfully loaded elements
    // console.log("\nBasic elements loaded successfully:");
    // this.loadingResults.loadedElements.forEach((element) => {
    //   console.log(`✓ ${element}`);
    // });

    // Commented out: Log any missing elements
    // if (this.loadingResults.missingElements.length > 0) {
    //   console.log("\nMissing basic elements:");
    //   this.loadingResults.missingElements.forEach((element) => {
    //     console.log(`✗ ${element}`);
    //   });
    // }

    // Commented out: Log elements with data-testid attributes
    // console.log("\nData-testid elements found:");
    // if (this.loadingResults.dataTestIdElements.length > 0) {
    //   this.loadingResults.dataTestIdElements.forEach((item, index) => {
    //     console.log(
    //       `${index + 1}. data-testid="${item.testId}" (${
    //         item.isVisible ? "visible" : "not visible"
    //       })`
    //     );
    //   });
    // } else {
    //   console.log("No elements with data-testid attribute found");
    // }
  } catch (error) {
    // Log and rethrow any errors encountered
    console.error("Error in Then step:", error);
    throw error;
  }
});

// Step definition for verifying the leaderboard is ranked correctly
Then("the leaderboard should be ranked correctly", async function () {
  try {
    // Wait for the leaderboard container to be present
    const leaderboardElement = await this.driver.wait(
      until.elementLocated(By.css('[data-testid="LEADERBOARD_CONTAINER"]')),
      10000, // Wait up to 10 seconds
      "Leaderboard container not found"
    );

    // Get the text content of the leaderboard
    const leaderboardText = await leaderboardElement.getText();
    // Split the text into lines and filter out empty lines
    const lines = leaderboardText
      .split("\n")
      .filter((line) => line.trim() !== "");

    // Parse the leaderboard data into an array of scores
    const scores = [];
    for (let i = 0; i < lines.length; i += 3) {
      const username = lines[i];
      const score = parseInt(lines[i + 1], 10);
      const rank = parseInt(lines[i + 2], 10);
      scores.push({ username, score, rank });
    }

    // Sort the scores in descending order
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);

    // Assert that the scores are sorted correctly
    expect(scores).to.deep.equal(
      sortedScores,
      "Leaderboard is not ranked correctly"
    );
  } catch (error) {
    // Log and rethrow any errors encountered
    console.error("Error in leaderboard ranking step:", error);
    throw error;
  }
});

// Step definition for clicking the Start Game button and waiting
When("I click the Start Game button and wait for 3 seconds", async function () {
  try {
    // Locate the Start Game button using its data-testid
    const startButton = await this.driver.findElement(
      By.css('[data-testid="START_BUTTON"]')
    );

    // Click the Start Game button
    await startButton.click();

    // Wait for 3 seconds
    await this.driver.sleep(3000);
    const userEmail = await this.driver.findElement(
      By.css('[data-testid="GAMEFORM_INPUT_FIELD"]')
    );
  } catch (error) {
    // Log and rethrow any errors encountered
    console.error("Error in clicking Start Game button step:", error);
    throw error;
  }
});

// Step definition for entering text and submitting the form
When("I enter the email and username and submit the form", async function () {
  try {
    // Find all input fields
    const inputFields = await this.driver.findElements(
      By.css('[data-testid="GAMEFORM_INPUT_FIELD"]')
    );

    // Find the email field by checking its type or placeholder
    const emailField = await Promise.all(
      inputFields.map(async (field) => {
        const type = await field.getAttribute("type");
        const placeholder = await field.getAttribute("placeholder");
        return { field, type, placeholder };
      })
    ).then(
      (fields) =>
        fields.find(
          (f) =>
            f.type === "email" || f.placeholder?.toLowerCase().includes("email")
        )?.field
    );

    // Find the username field by checking its type or placeholder
    const usernameField = await Promise.all(
      inputFields.map(async (field) => {
        const type = await field.getAttribute("type");
        const placeholder = await field.getAttribute("placeholder");
        return { field, type, placeholder };
      })
    ).then(
      (fields) =>
        fields.find(
          (f) =>
            f.type === "text" ||
            f.placeholder?.toLowerCase().includes("username")
        )?.field
    );

    if (!emailField || !usernameField) {
      throw new Error("Could not find email or username input fields");
    }

    // Enter the values
    await emailField.sendKeys("z@test01.com");
    await usernameField.sendKeys("test01");

    // Find and click the checkbox
    const checkbox = await this.driver.findElement(
      By.css('[data-testid="GAMEFORM_CHECKBOX"]')
    );
    await checkbox.click();

    // Locate and click the submit button
    const submitButton = await this.driver.findElement(
      By.css('[data-testid="GAMEFORM_SUBMIT_BUTTON"]')
    );
    await submitButton.click();

    // Wait for 3 seconds
    await this.driver.sleep(3000);
  } catch (error) {
    console.error("Error in form submission step:", error);
    throw error;
  }
});

// Step definition for game canvas interaction
When(
  "I perform the game clicks sequence",
  { timeout: 20000 },
  async function () {
    try {
      // Find the game canvas - using regular CSS selector for canvas element
      const canvas = await this.driver.findElement(By.css("canvas"));

      // Wait for the canvas to be visible and ready
      await this.driver.wait(
        until.elementIsVisible(canvas),
        10000,
        "Canvas not visible"
      );

      // Create an Actions instance for complex mouse interactions
      const actions = this.driver.actions({ async: true });

      // First click
      await actions.move({ origin: canvas }).click().perform();

      // Wait 2 seconds
      await this.driver.sleep(2000);

      // Second click
      await actions.move({ origin: canvas }).click().perform();

      // Wait 4 seconds
      await this.driver.sleep(4000);
    } catch (error) {
      console.error("Error in game clicks sequence:", error);
      throw error;
    }
  }
);
