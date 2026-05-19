const path = require('path');
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

const reactPascalCaseDirectoryRoots = new Set(['pages', 'components', 'layouts']);
const reactRelaxedDirectoryNames = new Set([
  'components',
  'utils',
  'types',
  'hooks',
  'constants',
  'consts',
]);
const supportedScriptExtensions = new Set([
  '.ts',
  '.cts',
  '.mts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
]);
const namingPatterns = {
  kebabCase: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  hookCamelCase: /^use[A-Z0-9][a-zA-Z0-9]*$/,
  pascalCase: /^[A-Z][a-zA-Z0-9]*$/,
};
const namingPatternLabels = {
  kebabCase: 'kebab-case',
  camelCase: 'camelCase',
  hookCamelCase: 'camelCase and start with "use"',
  pascalCase: 'PascalCase',
};

const reactRestrictedSyntaxEntries = [
  ...baseRestrictedSyntaxEntries,
  {
    selector:
      "JSXOpeningElement[name.name='img'] JSXAttribute[name.name='src'][value.expression.type!=/^(Identifier|CallExpression)$/]",
    message: 'Import the source file first.',
  },
];

const getLintTargetPathParts = (context) => {
  const { cwd, physicalFilename } = context;

  if (!physicalFilename || physicalFilename.startsWith('<')) {
    return null;
  }

  const relativePath = path.relative(cwd, physicalFilename);

  if (
    !relativePath
    || relativePath.startsWith('..')
    || path.isAbsolute(relativePath)
  ) {
    return null;
  }

  const normalizedPath = relativePath.split(path.sep).join('/');
  const pathParts = normalizedPath.split('/').filter(Boolean);

  if (!pathParts.length) {
    return null;
  }

  return {
    relativePath: normalizedPath,
    directoryParts: pathParts.slice(0, -1),
    fileName: pathParts[pathParts.length - 1],
  };
};

const getPrimaryFileName = (fileName) => {
  const firstDotIndex = fileName.indexOf('.');

  if (firstDotIndex === -1) {
    return fileName;
  }

  return fileName.slice(0, firstDotIndex);
};

const isUsePrefixedHookFileBaseName = (baseName) =>
  /^use(?:[A-Z0-9]|[-_])/.test(baseName);

const isHooksDirectoryFile = (directoryParts) => directoryParts.includes('hooks');

const getReactSpecialRootIndex = (directoryParts) =>
  directoryParts.findIndex((directoryName) =>
    reactPascalCaseDirectoryRoots.has(directoryName),
  );

const getExpectedReactFileNamePattern = (
  baseName,
  extension,
  directoryParts,
) => {
  if (
    isUsePrefixedHookFileBaseName(baseName)
    || isHooksDirectoryFile(directoryParts)
  ) {
    return 'hookCamelCase';
  }

  if (extension === '.tsx') {
    if (baseName === 'index') {
      return null;
    }

    if (getReactSpecialRootIndex(directoryParts) !== -1) {
      return 'pascalCase';
    }

    return null;
  }

  return 'kebabCase';
};

const reactNamingPlugin = {
  rules: {
    'filename-naming-convention': {
      meta: {
        type: 'suggestion',
        schema: [],
        messages: {
          unexpectedFileName:
            'The file "{{ relativePath }}" must use {{ namingPattern }} for "{{ baseName }}".',
        },
      },
      create(context) {
        return {
          Program(node) {
            const targetPathParts = getLintTargetPathParts(context);

            if (!targetPathParts) {
              return;
            }

            const { directoryParts, fileName, relativePath } = targetPathParts;
            const extension = path.extname(fileName);

            if (!supportedScriptExtensions.has(extension)) {
              return;
            }

            const baseName = getPrimaryFileName(fileName);
            const expectedPatternKey = getExpectedReactFileNamePattern(
              baseName,
              extension,
              directoryParts,
            );

            if (!expectedPatternKey) {
              return;
            }

            if (namingPatterns[expectedPatternKey].test(baseName)) {
              return;
            }

            context.report({
              node,
              messageId: 'unexpectedFileName',
              data: {
                relativePath,
                baseName,
                namingPattern: namingPatternLabels[expectedPatternKey],
              },
            });
          },
        };
      },
    },
    'folder-naming-convention': {
      meta: {
        type: 'suggestion',
        schema: [],
        messages: {
          unexpectedFolderName:
            'The folder "{{ directoryName }}" in "{{ relativePath }}" must use {{ namingPattern }}.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const targetPathParts = getLintTargetPathParts(context);

            if (!targetPathParts) {
              return;
            }

            const { directoryParts, relativePath } = targetPathParts;

            if (!directoryParts.length) {
              return;
            }

            let reactSpecialRootIndex = -1;

            for (let index = 0; index < directoryParts.length; index += 1) {
              const directoryName = directoryParts[index];
              let expectedPatternKey = 'kebabCase';

              if (
                reactSpecialRootIndex !== -1
                && index > reactSpecialRootIndex
                && !reactRelaxedDirectoryNames.has(directoryName)
              ) {
                expectedPatternKey = 'pascalCase';
              }

              if (!namingPatterns[expectedPatternKey].test(directoryName)) {
                context.report({
                  node,
                  messageId: 'unexpectedFolderName',
                  data: {
                    directoryName,
                    relativePath,
                    namingPattern: namingPatternLabels[expectedPatternKey],
                  },
                });
              }

              if (
                reactSpecialRootIndex === -1
                && reactPascalCaseDirectoryRoots.has(directoryName)
              ) {
                reactSpecialRootIndex = index;
              }
            }
          },
        };
      },
    },
  },
};

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

const reactNamingRules = {
  'liangqingda-react/filename-naming-convention': 'error',
  'liangqingda-react/folder-naming-convention': 'error',
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
      'liangqingda-react': reactNamingPlugin,
    },
    rules: reactNamingRules,
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
