import { By, until, WebDriver } from "selenium-webdriver";

class GamePage {
  constructor(driver) {
    this.driver = driver;
    this.timeout = 30000; // Default timeout for waiting operations

    // Define selectors for elements on the page
    this.selectors = {
      canvas: By.css("canvas"),
      body: By.css("body"),
      html: By.css("html"),
    };
  }

  // Method to find all elements with a data-testid attribute
  async findAllDataTestIds() {
    try {
      // Wait for at least one element with data-testid to be located
      await this.driver.wait(
        until.elementLocated(By.css("[data-testid]")),
        this.timeout,
        "No data-testid elements found"
      );

      // Find all elements with data-testid
      const elements = await this.driver.findElements(By.css("[data-testid]"));
      const dataTestIds = await Promise.all(
        elements.map(async (element) => {
          try {
            // Wait until the element is enabled
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

            // Retrieve attributes and properties of the element
            const testId = await element.getAttribute("data-testid");
            const isDisplayed = await element.isDisplayed();
            const tagName = await element.getTagName();
            let text = "";
            try {
              text = await element.getText();
            } catch (e) {
              text = "No text content";
            }

            // Return an object with element details
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

      // Filter out any null results
      return dataTestIds.filter((item) => item !== null);
    } catch (error) {
      console.error("Error finding data-testid elements:", error);
      return [];
    }
  }

  // Method to wait for an element to be visible
  async waitForElementVisible(selector, timeout = this.timeout) {
    try {
      // Wait for the element to be located
      await this.driver.wait(
        until.elementLocated(selector),
        timeout,
        `Element ${selector} not found`
      );

      // Find the element and wait for it to be visible
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

  // Method to check if the canvas element is ready
  async isCanvasReady() {
    try {
      // Wait for the canvas element to be visible
      const canvas = await this.waitForElementVisible(this.selectors.canvas);
      if (!canvas) return false;

      // Wait for the canvas to have non-zero dimensions
      await this.driver.wait(
        async () => {
          const width = await canvas.getAttribute("width");
          const height = await canvas.getAttribute("height");
          return width > 0 && height > 0;
        },
        this.timeout,
        "Canvas dimensions not set"
      );

      // Log the canvas dimensions
      const width = await canvas.getAttribute("width");
      const height = await canvas.getAttribute("height");
      console.log(`Canvas dimensions: ${width}x${height}`);
      return true;
    } catch (error) {
      console.error("Error checking canvas:", error);
      return false;
    }
  }

  // Method to check if all basic elements are loaded
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

    // Find all elements with data-testid and store them
    const dataTestIds = await this.findAllDataTestIds();
    results.dataTestIdElements = dataTestIds;

    // Check if the canvas is ready if it is loaded
    if (results.loadedElements.includes("canvas")) {
      const isCanvasReady = await this.isCanvasReady();
      console.log(`\nCanvas ready for interaction: ${isCanvasReady}`);
    }

    return results;
  }
}

export default GamePage;
