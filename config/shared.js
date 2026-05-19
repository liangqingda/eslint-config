const js = require('@eslint/js');
const tsEslint = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const noSecretsPlugin = require('eslint-plugin-no-secrets');
const prettierConfig = require('eslint-config-prettier');

const importExtensions = [
  '.ts',
  '.cts',
  '.mts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
];

const baseRestrictedSyntaxEntries = [
  'WithStatement',
  'DoWhileStatement',
  'ForStatement',
  'ForInStatement',
  {
    selector: "CallExpression[callee.name='require']",
    message: 'require is not recommended, use import instead.',
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'] MemberExpression[property.name=/^(copyWithin|fill|pop|push|reverse|shift|sort|splice|unshift)$/]",
    message: 'DO NOT CALL MUTATING FUNCTION, THANKS.',
  },
];

const constantsDirectoryFiles = [
  '**/{constants,consts}/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}',
];

const createRestrictedSyntaxRule = (entries) => ['error', ...entries];

const baseSettings = {
  'import/extensions': importExtensions,
  'import/external-module-folders': ['node_modules', 'node_modules/@types'],
  'import/parsers': {
    '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
  },
  'import/resolver': {
    node: {
      extensions: importExtensions,
    },
    typescript: {},
  },
};

const typedRules = {
  'no-throw-literal': 'off',
  '@typescript-eslint/no-for-in-array': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'error',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/only-throw-error': 'error',
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
};

const createConstantsDirectoryConfig = (name, restrictedSyntaxEntries) => ({
  name,
  files: constantsDirectoryFiles,
  rules: {
    'no-restricted-syntax': createRestrictedSyntaxRule([
      ...restrictedSyntaxEntries,
      {
        selector:
          "VariableDeclaration[kind='const'] > VariableDeclarator[id.type='Identifier'][id.name!=/^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/][init.type!='ArrowFunctionExpression'][init.type!='FunctionExpression']",
        message:
          'Const variables in constants/ or consts/ files must use UPPER_CASE unless the initializer is a function.',
      },
    ]),
  },
});

module.exports = {
  js,
  tsEslint,
  importPlugin,
  noSecretsPlugin,
  prettierConfig,
  baseSettings,
  baseRestrictedSyntaxEntries,
  typedRules,
  createRestrictedSyntaxRule,
  createConstantsDirectoryConfig,
};
