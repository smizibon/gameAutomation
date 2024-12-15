import { By } from "selenium-webdriver";

class GamePage {
  constructor(driver) {
    this.driver = driver;
    this.canvasSelector = By.css("canvas");
  }

  async isCanvasDisplayed() {
    const canvas = await this.driver.findElement(this.canvasSelector);
    return canvas.isDisplayed();
  }
}

export default GamePage;
