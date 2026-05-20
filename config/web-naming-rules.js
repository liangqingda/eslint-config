// 定义面向 Web/React 项目的文件与目录命名规则插件。
const path = require('path');

// 进入这些目录后，后续后代目录默认切换为 PascalCase 规则。
const reactPascalCaseDirectoryModeRoots = new Set([
  'pages',
  'views',
  'components',
  'layouts',
]);
// 进入这些目录后，后续后代目录默认切换为 kebab-case 规则。
const reactKebabCaseDirectoryModeRoots = new Set([
  'utils',
  'types',
  'hooks',
  'store',
  'constants',
  'consts',
]);
// 这些目录名本身在任何位置都允许直接使用固定的小写写法。
const reactAlwaysAllowedDirectoryNames = new Set([
  'components',
  'layouts',
  ...reactKebabCaseDirectoryModeRoots,
]);
// 位于大驼峰目录树内时，允许保留当前写法的特殊主文件名。
const reactPascalCaseFileNameExceptions = new Set([
  'utils',
  'index',
  'types',
  'hooks',
  'consts',
  'constants',
  'store',
]);
// 任何位置下，只要文件名使用 PascalCase，就只允许搭配这些扩展名。
const reactPascalCaseFileExtensions = new Set(['.jsx', '.tsx', '.vue']);
// 只有直接位于这些目录下的根文件，才要求使用 useXxx 命名。
const reactUsePrefixedFileDirectoryNames = new Set(['hooks', 'store']);
// 参与这套命名规则检查的脚本文件扩展名集合。
const supportedScriptExtensions = new Set([
  '.ts',
  '.cts',
  '.mts',
  '.tsx',
  '.vue',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
]);
// 各类文件或目录命名风格对应的正则表达式。
const namingPatterns = {
  kebabCase: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  usePrefixedCamelCase: /^use[A-Z0-9][a-zA-Z0-9]*$/,
  pascalCase: /^[A-Z][a-zA-Z0-9]*$/,
};
// 生成错误提示时使用的人类可读命名风格描述。
const namingPatternLabels = {
  kebabCase: 'kebab-case',
  camelCase: 'camelCase',
  usePrefixedCamelCase: 'camelCase and start with "use"',
  pascalCase: 'PascalCase',
};
// 对外暴露给 Web 配置启用的命名规则开关集合。
const webNamingRules = {
  'liangqingda-react/filename-naming-convention': 'error',
  'liangqingda-react/folder-naming-convention': 'error',
};

// 将 ESLint 当前处理文件转换为可用于命名判断的相对路径结构。
const getLintTargetPathParts = (context) => {
  const { cwd, physicalFilename } = context;

  if (!physicalFilename || physicalFilename.startsWith('<')) {
    return null;
  }

  const relativePath = path.relative(cwd, physicalFilename);

  if (
    !relativePath ||
    relativePath.startsWith('..') ||
    path.isAbsolute(relativePath)
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

// 提取文件名中第一个 `.` 之前的主文件名，用于统一做命名检查。
const getPrimaryFileName = (fileName) => {
  const firstDotIndex = fileName.indexOf('.');

  if (firstDotIndex === -1) {
    return fileName;
  }

  return fileName.slice(0, firstDotIndex);
};

// 判断主文件名是否为 `useXxx` 形式的小驼峰命名。
const isUsePrefixedFileBaseName = (baseName) =>
  /^use[A-Z0-9][a-zA-Z0-9]*$/.test(baseName);

// 判断当前文件是否直接位于 `hooks/` 或 `store/` 目录下。
const isInReactUsePrefixedRootFileDirectory = (directoryParts) => {
  if (!directoryParts.length) {
    return false;
  }

  return reactUsePrefixedFileDirectoryNames.has(
    directoryParts[directoryParts.length - 1],
  );
};

// 根据整条目录路径推导当前文件最终应该继承的命名模式。
const getExpectedReactFilePatternKeyByDirectoryParts = (directoryParts) =>
  directoryParts.reduce((expectedFilePatternKey, directoryName) => {
    if (reactKebabCaseDirectoryModeRoots.has(directoryName)) {
      return 'kebabCase';
    }

    if (reactPascalCaseDirectoryModeRoots.has(directoryName)) {
      return 'pascalCase';
    }

    return expectedFilePatternKey;
  }, 'kebabCase');

// 计算单个目录节点在当前位置下应该遵循的目录命名模式。
const getExpectedReactDirectoryPatternKey = (
  directoryName,
  expectedNestedDirectoryPatternKey,
) =>
  reactAlwaysAllowedDirectoryNames.has(directoryName)
    ? null
    : expectedNestedDirectoryPatternKey;

// 进入某个目录节点后，推导其后代目录后续应切换到的命名模式。
const getNextReactNestedDirectoryPatternKey = (
  directoryName,
  expectedNestedDirectoryPatternKey,
) => {
  if (reactPascalCaseDirectoryModeRoots.has(directoryName)) {
    return 'pascalCase';
  }

  if (reactKebabCaseDirectoryModeRoots.has(directoryName)) {
    return 'kebabCase';
  }

  return expectedNestedDirectoryPatternKey;
};

// 综合目录语义、扩展名与特殊保留名，计算当前文件应使用的命名模式。
const getExpectedReactFileNamePattern = (
  baseName,
  extension,
  directoryParts,
) => {
  const isInUsePrefixedRootFileDirectory =
    isInReactUsePrefixedRootFileDirectory(directoryParts);

  if (isInUsePrefixedRootFileDirectory) {
    return 'usePrefixedCamelCase';
  }

  if (isUsePrefixedFileBaseName(baseName)) {
    return 'kebabCase';
  }

  if (namingPatterns.pascalCase.test(baseName)) {
    if (reactPascalCaseFileExtensions.has(extension)) {
      return null;
    }

    return 'kebabCase';
  }

  const expectedFilePatternKey = getExpectedReactFilePatternKeyByDirectoryParts(
    directoryParts,
  );

  if (expectedFilePatternKey === 'pascalCase') {
    if (reactPascalCaseFileNameExceptions.has(baseName)) {
      return null;
    }

    return 'pascalCase';
  }

  return expectedFilePatternKey;
};

// 自定义 ESLint 插件，实现 Web 项目的文件名与目录名校验。
const webNamingPlugin = {
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

            let expectedNestedDirectoryPatternKey = 'kebabCase';

            for (let index = 0; index < directoryParts.length; index += 1) {
              const directoryName = directoryParts[index];
              const expectedPatternKey = getExpectedReactDirectoryPatternKey(
                directoryName,
                expectedNestedDirectoryPatternKey,
              );

              if (
                expectedPatternKey &&
                !namingPatterns[expectedPatternKey].test(directoryName)
              ) {
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

              expectedNestedDirectoryPatternKey =
                getNextReactNestedDirectoryPatternKey(
                  directoryName,
                  expectedNestedDirectoryPatternKey,
                );
            }
          },
        };
      },
    },
  },
};

module.exports = {
  webNamingPlugin,
  webNamingRules,
};
