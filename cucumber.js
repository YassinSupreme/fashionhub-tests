module.exports = {
  default: {
    paths:       ['tests/**/*.feature'],
    require:     ['tests/bdd/support/**/*.ts', 'tests/bdd/step_definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      '@cucumber/pretty-formatter',
      'json:reports/cucumber-report.json',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    parallel: 2,
  },
};
