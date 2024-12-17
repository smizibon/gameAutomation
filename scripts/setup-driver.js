import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import chromedriver from "chromedriver";

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the absolute path for the drivers directory
const driversDir = path.resolve(__dirname, "../drivers");

// Log the directory path for verification
console.log("Setting up drivers in directory:", driversDir);

// Create drivers directory if it doesn't exist
if (!fs.existsSync(driversDir)) {
  fs.mkdirSync(driversDir);
  console.log("Created drivers directory:", driversDir);
} else {
  console.log("Drivers directory already exists:", driversDir);
}

// Download and copy ChromeDriver
console.log("Downloading ChromeDriver...");
try {
  // Get the path to the downloaded ChromeDriver
  const chromedriverPath = chromedriver.path;

  // Create destination path
  const destinationPath = path.join(driversDir, "chromedriver");

  // Copy ChromeDriver to drivers folder
  fs.copyFileSync(chromedriverPath, destinationPath);

  // Make the copied file executable
  fs.chmodSync(destinationPath, "755");

  console.log(
    "ChromeDriver downloaded and copied successfully to drivers folder"
  );
} catch (error) {
  console.error("Error setting up ChromeDriver:", error);
}
