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
  // 490 行挡不住「一个文件塞多个职责」，收到 300（注释不计）
  'max-lines': ['error', { max: 300, skipComments: true }],
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
          // 路径分组按顺序匹配，页面侧要写在 `@/**` 前面才会被单独归组：
          // 有 `src/pages` 的项目里页面代码排在公共 @/ 之后，没有该目录的项目不受影响
          pattern: '@/pages/**',
          group: 'parent',
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
      distinctGroup: true,
      named: false,
      sortTypesGroup: false,
      warnOnUnassignedImports: false,
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
