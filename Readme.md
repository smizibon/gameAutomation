# Game Automation Testing Framework

This project is an automated testing framework for web-based games using Selenium WebDriver, Cucumber.js, and Node.js. It implements the Page Object Model (POM) design pattern and provides detailed test reporting capabilities.

## Features

- Selenium WebDriver integration for browser automation
- Cucumber.js for BDD-style test scenarios
- Page Object Model implementation
- Detailed test reporting with screenshots on failure
- Support for data-testid element detection
- Canvas element validation
- Comprehensive error handling and logging

## Prerequisites

- Node.js (Latest LTS version recommended)
- Chrome browser
- Git

## Installation and RUN the tests

1. Clone the repository:
   git clone https://github.com/smizibon/gameAutomation.git
   cd gameAutomation

2. Install dependencies:
   npm install
   npm run setup:driver

3. Run the tests:
   npm test

## Project Structure

├── features/  
│ ├── page_objects/ # Page Object Model implementations  
│ ├── step_definitions/ # Cucumber step definitions  
│ ├── support/ # Test setup and hooks  
│ └── game.feature # Test scenarios in Gherkin syntax  
├── scripts/  
│ └── setup-driver.js # Driver setup script  
├── drivers/ # WebDriver binaries  
├── cucumber.js # Cucumber configuration  
└── package.json # Project dependencies and scripts

## Generate HTML report:

npm run test:report

## Current Test Coverage :

- Game interface loading validation
- Canvas element verification
- Data-testid elements detection
- Leaderboard content verification
