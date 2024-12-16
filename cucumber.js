export default {
  default: `
    --format progress-bar 
    --format html:cucumber-report.html
    --require-module @babel/register 
    --import features/**/*.js
    --publish-quiet
    --parallel 1
    --format @cucumber/pretty-formatter
    --retry 1
    --retry-tag-filter '@flaky'
    --world-parameters '{"timeout": 60000}'
  `,
};
