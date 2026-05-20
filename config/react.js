const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

const {
  baseSettings,
  typedRules,
  baseRestrictedSyntaxEntries,
  createRestrictedSyntaxRule,
  createConstantsDirectoryConfig,
} = require('./shared');
const { baseConfig } = require('./base');
const { webNamingPlugin, webNamingRules } = require('./web-naming-rules');

const reactRestrictedSyntaxEntries = [
  ...baseRestrictedSyntaxEntries,
  {
    selector:
      "JSXOpeningElement[name.name='img'] JSXAttribute[name.name='src'][value.expression.type!=/^(Identifier|CallExpression)$/]",
    message: 'Import the source file first.',
  },
];

const reactRules = {
  'max-lines': ['error', { max: 490, skipComments: true }],
  'space-before-function-paren': 'off',
  'arrow-parens': ['error', 'always'],
  'import/order': [
    'error',
    {
      'newlines-between': 'always',
      pathGroups: [
        {
          pattern: '*.{less,css,scss}',
          patternOptions: { matchBase: true },
          group: 'sibling',
          position: 'after',
        },
        {
          pattern: '@/**',
          group: 'internal',
        },
      ],
      groups: [
        'builtin',
        'external',
        'type',
        'internal',
        ['parent', 'sibling', 'index'],
        'object',
      ],
    },
  ],
  'import/no-duplicates': 'error',
  'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
  'react/self-closing-comp': 'error',
  'react/jsx-wrap-multilines': 'error',
  'react/jsx-pascal-case': 'error',
  'react/jsx-tag-spacing': 'error',
  'react/prop-types': 'off',
  'react/jsx-sort-props': 'error',
  'react/jsx-boolean-value': 'error',
  'react/no-array-index-key': 'error',
  'react/jsx-no-bind': ['error', { allowArrowFunctions: true }],
  'react/jsx-curly-brace-presence': 'error',
  'react/destructuring-assignment': 'error',
  'react/no-deprecated': 'error',
  'no-restricted-syntax': createRestrictedSyntaxRule(
    reactRestrictedSyntaxEntries,
  ),
  'react/jsx-uses-react': 'off',
  'react/react-in-jsx-scope': 'off',
  'react/display-name': 'off',
};

/** @type {import('eslint').Linter.Config[]} */
const reactConfig = [
  ...baseConfig,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooksPlugin.configs.flat.recommended,
  {
    name: '@liangqingda/eslint-config/react',
    settings: {
      ...baseSettings,
      react: {
        version: 'detect',
      },
    },
    rules: reactRules,
  },
  {
    name: '@liangqingda/eslint-config/react/naming',
    plugins: {
      'liangqingda-react': webNamingPlugin,
    },
    rules: webNamingRules,
  },
  createConstantsDirectoryConfig(
    '@liangqingda/eslint-config/react/constants',
    reactRestrictedSyntaxEntries,
  ),
];

/** @type {import('eslint').Linter.Config[]} */
const reactTypedConfig = [
  ...reactConfig,
  {
    name: '@liangqingda/eslint-config/react-typed',
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: typedRules,
  },
];

module.exports = {
  reactConfig,
  reactTypedConfig,
};
