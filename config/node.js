const checkFilePlugin = require('eslint-plugin-check-file');
const globals = require('globals');

const { typedRules } = require('./shared');
const { baseConfig } = require('./base');

const nodeNamingRules = {
  'check-file/filename-naming-convention': [
    'error',
    {
      '**/*.{js,ts,mjs,cjs,mts,cts}': 'KEBAB_CASE',
    },
    {
      ignoreMiddleExtensions: true,
    },
  ],
  'check-file/folder-naming-convention': [
    'error',
    {
      '**/*/': 'KEBAB_CASE',
    },
  ],
};

/** @type {import('eslint').Linter.Config[]} */
const nodeConfig = [
  ...baseConfig,
  {
    name: '@liangqingda/eslint-config/node',
    plugins: {
      'check-file': checkFilePlugin,
    },
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.nodeBuiltin,
      },
    },
    rules: nodeNamingRules,
  },
];

/** @type {import('eslint').Linter.Config[]} */
const nodeTypedConfig = [
  ...nodeConfig,
  {
    name: '@liangqingda/eslint-config/node-typed',
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: typedRules,
  },
];

module.exports = {
  nodeConfig,
  nodeTypedConfig,
};
