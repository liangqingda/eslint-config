const {
  js,
  tsEslint,
  importPlugin,
  noSecretsPlugin,
  prettierConfig,
  baseSettings,
  baseRestrictedSyntaxEntries,
  createRestrictedSyntaxRule,
  createConstantsDirectoryConfig,
} = require('./shared');

const baseRules = {
  'no-secrets/no-secrets': ['error', { tolerance: 5 }],
  'no-else-return': ['error', { allowElseIf: false }],
  'import/first': 'error',
  'import/newline-after-import': 'error',
  'no-return-assign': ['error', 'always'],
  'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
  'import/named': 'off',
  'import/no-named-as-default-member': 'off',
  semi: ['error', 'always'],
  eqeqeq: 'error',
  curly: 'error',
  'prefer-destructuring': 'error',
  'no-extra-bind': 'error',
  'no-extra-label': 'error',
  'no-useless-call': 'error',
  'spaced-comment': 'error',
  'multiline-comment-style': 'error',
  quotes: [
    'error',
    'single',
    { avoidEscape: true, allowTemplateLiterals: false },
  ],
  'prefer-template': 'error',
  'eol-last': ['error', 'always'],
  'no-multiple-empty-lines': [
    'error',
    {
      max: 1,
      maxEOF: 0,
    },
  ],
  'padding-line-between-statements': [
    'error',
    {
      blankLine: 'always',
      prev: ['var', 'const', 'let', 'class'],
      next: '*',
    },
    {
      blankLine: 'any',
      prev: ['const', 'let', 'var'],
      next: ['const', 'let', 'var'],
    },
    { blankLine: 'always', prev: '*', next: 'export' },
    { blankLine: 'always', prev: ['block-like', 'function'], next: '*' },
    { blankLine: 'always', prev: '*', next: ['block-like', 'function'] },
  ],
  'padded-blocks': 'off',
  'arrow-body-style': 'error',
  'prefer-arrow-callback': 'error',
  'no-param-reassign': [
    'error',
    {
      props: true,
    },
  ],
  'no-loop-func': 'error',
  'no-await-in-loop': 'error',
  'no-restricted-syntax': createRestrictedSyntaxRule(
    baseRestrictedSyntaxEntries,
  ),
  'object-curly-spacing': ['error', 'always'],
  'key-spacing': [
    'error',
    {
      afterColon: true,
    },
  ],
  'keyword-spacing': 'error',
  'no-trailing-spaces': 'error',
  'no-multi-spaces': 'error',
  'space-infix-ops': 'error',
  'space-in-parens': 'error',
  'space-before-blocks': 'error',
  'no-unneeded-ternary': 'error',
  'no-nested-ternary': 'error',
  'no-func-assign': 'error',
  'no-class-assign': 'error',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false,
      varsIgnorePattern: '_',
      argsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'enum',
      format: ['PascalCase'],
      suffix: ['Enum'],
    },
  ],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      // 值导入里不要内联 type：类型单独 `import type`，运行时导入保持干净
      fixStyle: 'separate-type-imports',
      prefer: 'type-imports',
    },
  ],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/adjacent-overload-signatures': 'error',
  '@typescript-eslint/no-inferrable-types': 'error',
  '@typescript-eslint/method-signature-style': 'error',
  'import/order': [
    'error',
    {
      'newlines-between': 'always',
      // type 不再单独成组：类型 import 跟着来源路径走（外部的归 external、
      // @/ 的归 internal、就近的归 parent/sibling），就近引用内部再按 ../ 和 ./ 拆块
      pathGroups: [
        {
          pattern: '@/**',
          group: 'internal',
        },
      ],
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
      ],
      distinctGroup: true,
      named: false,
      sortTypesGroup: false,
      warnOnUnassignedImports: false,
    },
  ],
  'import/no-dynamic-require': 'error',
  'import/no-cycle': 'error',
  'import/no-useless-path-segments': 'error',
  'import/export': 'error',
  'import/no-mutable-exports': 'error',
  'no-restricted-imports': ['error', { paths: ['console'] }],
  'no-restricted-globals': [
    'error',
    {
      name: 'status',
      message:
        'Do not use global variable [status]. Use local variable instead.',
    },
    {
      name: 'name',
      message: 'Do not use global variable [name]. Use local variable instead.',
    },
    {
      name: 'open',
      message: 'Do not use global variable [open]. Use local variable instead.',
    },
  ],
};

/** @type {import('eslint').Linter.Config[]} */
const baseConfig = [
  js.configs.recommended,
  ...tsEslint.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  prettierConfig,
  {
    name: '@liangqingda/eslint-config/base',
    plugins: {
      'no-secrets': noSecretsPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    settings: baseSettings,
    rules: baseRules,
  },
  createConstantsDirectoryConfig(
    '@liangqingda/eslint-config/base/constants',
    baseRestrictedSyntaxEntries,
  ),
];

module.exports = {
  baseConfig,
};
