export default {
  default: `
        --format progress-bar            // Shows progress during test execution
        --format html:cucumber-report.html   // Generates HTML report
        --require-module @babel/register     // Enables Babel for ES6+ features
        --import features/step_definitions/**/*.js   // Imports step definitions
        --import features/support/**/*.js    // Imports support files
    `,
};
