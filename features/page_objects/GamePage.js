import { By, until } from "selenium-webdriver";

class GamePage {
  constructor(driver) {
    this.driver = driver;
    this.canvasSelector = By.css("canvas");
  }

  async isCanvasDisplayed() {
    try {
      const canvas = await this.driver.wait(
        until.elementLocated(this.canvasSelector),
        10000,
        "Canvas element not found"
      );
      return await canvas.isDisplayed();
    } catch (error) {
      console.error("Error checking canvas display:", error);
      throw error;
    }
  }
}

export default GamePage;
