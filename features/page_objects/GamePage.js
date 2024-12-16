import { By, until, WebDriver } from "selenium-webdriver";

class GamePage {
  constructor(driver) {
    this.driver = driver;
    this.timeout = 30000;

    this.selectors = {
      canvas: By.css("canvas"),
      body: By.css("body"),
      html: By.css("html"),
    };
  }

  async findAllDataTestIds() {
    try {
      await this.driver.wait(
        until.elementLocated(By.css("[data-testid]")),
        this.timeout,
        "No data-testid elements found"
      );

      const elements = await this.driver.findElements(By.css("[data-testid]"));
      const dataTestIds = await Promise.all(
        elements.map(async (element) => {
          try {
            await this.driver.wait(
              async () => {
                try {
                  return await element.isEnabled();
                } catch {
                  return false;
                }
              },
              this.timeout,
              "Element not interactive"
            );

            const testId = await element.getAttribute("data-testid");
            const isDisplayed = await element.isDisplayed();
            const tagName = await element.getTagName();
            let text = "";
            try {
              text = await element.getText();
            } catch (e) {
              text = "No text content";
            }

            return {
              testId,
              isDisplayed,
              element,
              tagName,
              text,
            };
          } catch (error) {
            console.error(`Error processing element:`, error);
            return null;
          }
        })
      );

      return dataTestIds.filter((item) => item !== null);
    } catch (error) {
      console.error("Error finding data-testid elements:", error);
      return [];
    }
  }

  async waitForElementVisible(selector, timeout = this.timeout) {
    try {
      await this.driver.wait(
        until.elementLocated(selector),
        timeout,
        `Element ${selector} not found`
      );

      const element = await this.driver.findElement(selector);
      await this.driver.wait(
        until.elementIsVisible(element),
        timeout,
        `Element ${selector} not visible`
      );

      return element;
    } catch (error) {
      console.error(`Wait failed for ${selector}:`, error.message);
      return null;
    }
  }

  async isCanvasReady() {
    try {
      const canvas = await this.waitForElementVisible(this.selectors.canvas);
      if (!canvas) return false;

      await this.driver.wait(
        async () => {
          const width = await canvas.getAttribute("width");
          const height = await canvas.getAttribute("height");
          return width > 0 && height > 0;
        },
        this.timeout,
        "Canvas dimensions not set"
      );

      const width = await canvas.getAttribute("width");
      const height = await canvas.getAttribute("height");
      console.log(`Canvas dimensions: ${width}x${height}`);
      return true;
    } catch (error) {
      console.error("Error checking canvas:", error);
      return false;
    }
  }

  async checkAllElementsLoaded() {
    const results = {
      success: true,
      loadedElements: [],
      missingElements: [],
      dataTestIdElements: [],
    };

    console.log("\nChecking basic elements:");
    for (const [elementName, selector] of Object.entries(this.selectors)) {
      const element = await this.waitForElementVisible(selector);
      if (element) {
        console.log(`✓ ${elementName} is visible`);
        results.loadedElements.push(elementName);
      } else {
        console.log(`✗ ${elementName} not found or not visible`);
        results.missingElements.push(elementName);
        results.success = false;
      }
    }

    const dataTestIds = await this.findAllDataTestIds();
    console.log(`\nFound ${dataTestIds.length} elements with data-testid\n`);

    dataTestIds.forEach((item, index) => {
      console.log(`${index + 1}. Element:`);
      console.log(`   Data-TestID: ${item.testId}`);
      console.log(`   Tag: <${item.tagName}>`);
      console.log(`   Visible: ${item.isDisplayed}`);
      console.log(`   Text: ${item.text}`);
      console.log("-".repeat(50));
    });

    if (results.loadedElements.includes("canvas")) {
      const isCanvasReady = await this.isCanvasReady();
      console.log(`\nCanvas ready for interaction: ${isCanvasReady}`);
    }

    return results;
  }
}

export default GamePage;
