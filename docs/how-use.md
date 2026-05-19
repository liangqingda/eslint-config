# 如何使用 `@liangqingda/eslint-config`

这份文档专门说明这套公共 ESLint 配置在 React 项目和 Node.js 后端项目里的接入方式。

当前包导出了 6 套 Flat Config 和 1 份共享 Prettier 配置：

| 导出路径 | 适用场景 |
| --- | --- |
| `@liangqingda/eslint-config` | JavaScript 项目，或不启用类型信息规则的 TypeScript 项目 |
| `@liangqingda/eslint-config/typed` | 需要 TypeScript 类型检查规则的项目 |
| `@liangqingda/eslint-config/node` | Node.js + JavaScript + ESM 后端项目 |
| `@liangqingda/eslint-config/node-typed` | Node.js + TypeScript + ESM 后端项目 |
| `@liangqingda/eslint-config/react` | React 项目 |
| `@liangqingda/eslint-config/react-typed` | React + TypeScript 项目，且需要类型检查规则 |
| `@liangqingda/eslint-config/prettier.json` | 共享 Prettier 配置 |

## 安装

这个包发布在 GitHub Packages，上游项目需要先确保可以安装 `@liangqingda` 作用域下的包。

安装依赖：

```bash
pnpm add -D @liangqingda/eslint-config eslint prettier typescript
```

如果你使用 `npm`：

```bash
npm install -D @liangqingda/eslint-config eslint prettier typescript
```

## React 项目

### React + TypeScript

如果项目是 React + TypeScript，并且希望启用依赖类型信息的规则，推荐使用 `react-typed`。

在项目根目录创建 `eslint.config.js`：

```js
const reactTypedConfig = require('@liangqingda/eslint-config/react-typed');

module.exports = [...reactTypedConfig];
```

适用前提：

- 项目中需要存在可被 ESLint 识别的 `tsconfig.json`
- 如果是 monorepo，需要保证 ESLint 能正确找到对应 TS 工程

### React + JavaScript

如果项目是 React + JavaScript，或者暂时不想启用依赖类型信息的规则，可以使用 `react`：

```js
const reactConfig = require('@liangqingda/eslint-config/react');

module.exports = [...reactConfig];
```

### React 项目补充说明

- React 配置已经内置 `eslint-plugin-react`、`eslint-plugin-react-hooks` 和 `jsx-runtime` 相关规则。
- React 版本使用 `detect` 自动识别，不需要手动指定版本。
- 样式文件导入如 `*.css`、`*.less`、`*.scss` 会参与导入顺序校验。
- JSX 中对 `<img src={...}>` 有额外限制，推荐先 `import` 资源，再传给 `src`。

## Node.js 后端项目

### Node.js + TypeScript + ESM

如果后端项目是 Node.js + TypeScript，并且使用 ESM，推荐使用 `node-typed`：

```js
const nodeTypedConfig = require('@liangqingda/eslint-config/node-typed');

module.exports = [...nodeTypedConfig];
```

这套配置已经内置：

- 依赖类型信息的 TypeScript 规则
- Node.js ESM 运行时常用 globals
- `sourceType: "module"`

因此同样要求项目里有可识别的 `tsconfig.json`。

### Node.js + JavaScript + ESM

如果后端项目是 Node.js + JavaScript，并且使用 ESM，推荐使用 `node`：

```js
const nodeConfig = require('@liangqingda/eslint-config/node');

module.exports = [...nodeConfig];
```

### Node.js 项目补充说明

- `node` 和 `node-typed` 都是面向 ESM 风格后端项目设计的。
- 这套公共配置默认不推荐 `require(...)`，更推荐使用 `import`。
- `node` 和 `node-typed` 已经内置了 Node.js ESM 环境下常用的 globals，所以大多数后端项目不需要再手动补 `process`、`Buffer`、`console`。
- 当前没有内置 CommonJS 风格的 `require`、`module`、`__dirname`、`__filename` 全局。

如果你确实希望额外添加自定义 globals，可以在使用方项目里补一层：

```js
const nodeConfig = require('@liangqingda/eslint-config/node');

module.exports = [
  ...nodeConfig,
  {
    languageOptions: {
      globals: {
        MY_CUSTOM_GLOBAL: 'readonly',
      },
    },
  },
];
```

## Prettier 配置

如果希望共用 Prettier 配置，可以在项目根目录创建 `.prettierrc.js`：

```js
module.exports = require('@liangqingda/eslint-config/prettier.json');
```

补充说明：

- 链式调用换行不是通过 `prettier.json` 单独控制的，而是由这套 ESLint 规则统一约束。
- 当前共享配置要求链式调用从第二段开始换行，例如 `foo().bar()` 需要改成多行链式写法。
- 如果同一段代码后续还会再经过 Prettier 格式化，较短链式调用可能被重新压回单行，这时应以 ESLint fix 的结果为准，或调整使用方的格式化流程。

推荐做法：

- JavaScript / TypeScript 代码风格修复优先使用 `eslint --fix`
- Prettier 继续负责通用格式化，但不要指望它单独维持链式调用换行
- 如果是编辑器保存自动修复，优先配置为保存时执行 ESLint fix

## 常见接入方式总结

- React + TypeScript：`@liangqingda/eslint-config/react-typed`
- React + JavaScript：`@liangqingda/eslint-config/react`
- Node.js + JavaScript + ESM：`@liangqingda/eslint-config/node`
- Node.js + TypeScript + ESM：`@liangqingda/eslint-config/node-typed`
- 普通 JavaScript 项目：`@liangqingda/eslint-config`
- TypeScript 项目，需要类型规则：`@liangqingda/eslint-config/typed`

## 注意事项

- 这套配置导出的是 Flat Config 数组，不支持 `.eslintrc` 风格的 `extends` 用法。
- 使用方项目需要通过 `eslint.config.js`、`eslint.config.cjs` 或 `eslint.config.mjs` 接入。
- `typed`、`node-typed` 和 `react-typed` 都依赖 TypeScript 工程信息，首次接入旧项目时通常会比基础配置报出更多问题。
- 当前规则整体偏严格，包含导入顺序、不可变写法、空行风格、React 组件写法等约束，建议旧项目分批修复。
