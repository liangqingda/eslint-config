const { typedRules } = require('./shared');
const { baseConfig } = require('./base');

/** @type {import('eslint').Linter.Config[]} */
const typedConfig = [
  ...baseConfig,
  {
    name: '@liangqingda/eslint-config/typed',
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: typedRules,
  },
];

module.exports = {
  typedConfig,
};
