export default {
  default: `
        --format progress-bar
        --format html:cucumber-report.html
        --require-module @babel/register
        --import features/step_definitions/**/*.js
        --import features/support/**/*.js
    `,
};
