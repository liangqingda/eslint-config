# @liangqingda/eslint-config

一套可复用的 ESLint / Prettier 配置，适用于 JavaScript、TypeScript 和 React 项目。

目前仓库导出了 4 套 Flat Config 和 1 份 Prettier 配置：

- `@liangqingda/eslint-config`：基础 Flat Config
- `@liangqingda/eslint-config/typed`：需要 TypeScript 类型信息的 Flat Config
- `@liangqingda/eslint-config/react`：React Flat Config
- `@liangqingda/eslint-config/react-typed`：React + TypeScript 类型检查 Flat Config
- `@liangqingda/eslint-config/prettier.json`：共享 Prettier 配置

## 包含内容

基础 ESLint 配置主要包含：

- `@eslint/js` 的 `recommended`
- 不依赖类型信息的 `@typescript-eslint` Flat Config
- `eslint-plugin-import` 导入顺序与模块规范
- `eslint-config-prettier`，用于避免和 Prettier 冲突
- 一些偏团队约束的代码风格与安全规则

Typed 配置基于基础配置继续扩展：

- 需要 TypeScript 类型信息的规则
- `parserOptions.projectService: true`

React 配置基于基础配置继续扩展：

- `plugin:react/recommended`
- `plugin:react-hooks/recommended`
- JSX / React 组件相关规则

React Typed 配置组合了 React 配置和 Typed 配置。

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

## 使用方式

### 1. 基础 Flat Config

在项目根目录创建 `eslint.config.js`：

```js
const baseConfig = require('@liangqingda/eslint-config');

module.exports = [...baseConfig];
```

适用于普通 JavaScript 项目，或不希望启用类型信息规则的 TypeScript 项目。

### 2. TypeScript 类型检查配置

如果你希望启用依赖类型信息的规则：

```js
const typedConfig = require('@liangqingda/eslint-config/typed');

module.exports = [...typedConfig];
```

项目中需要存在可被 ESLint 识别的 `tsconfig.json`。

### 3. React 项目配置

React 项目可以直接使用 React 扩展配置：

```js
const reactConfig = require('@liangqingda/eslint-config/react');

module.exports = [...reactConfig];
```

### 4. React + TypeScript 类型检查配置

如果 React 项目也希望启用依赖类型信息的规则：

```js
const reactTypedConfig = require('@liangqingda/eslint-config/react-typed');

module.exports = [...reactTypedConfig];
```

### 5. Prettier 配置

在项目根目录创建 `.prettierrc.js`：

```js
module.exports = require('@liangqingda/eslint-config/prettier.json');
```

如果你更喜欢 JSON，也可以直接复制仓库中的 [`prettier.json`](/Users/lqd/projects/eslint-config/prettier.json) 内容。

## 配置说明

仓库内的导出文件如下：

- [`index.js`](/Users/lqd/projects/eslint-config/index.js)：基础 Flat Config 入口
- [`typed.js`](/Users/lqd/projects/eslint-config/typed.js)：TypeScript 类型检查 Flat Config 入口
- [`react.js`](/Users/lqd/projects/eslint-config/react.js)：React Flat Config 入口
- [`react-typed.js`](/Users/lqd/projects/eslint-config/react-typed.js)：React + TypeScript 类型检查 Flat Config 入口
- [`configs.js`](/Users/lqd/projects/eslint-config/configs.js)：共享配置组合逻辑
- [`prettier.json`](/Users/lqd/projects/eslint-config/prettier.json)：共享 Prettier 配置

## 依赖说明

### Peer Dependencies

使用方项目需要自行安装以下依赖：

- `eslint`
- `prettier`
- `typescript`

### 包内依赖

这个仓库自身内置了 ESLint 配置所需插件，包括但不限于：

- `@eslint/js`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-config-prettier`
- `eslint-import-resolver-typescript`
- `eslint-plugin-import`
- `eslint-plugin-no-secrets`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`

## 注意事项

- 当前导出的是 Flat Config 数组，不再提供 `.eslintrc` 风格的 `extends` 用法。
- 使用方项目需要基于 `eslint.config.js` / `eslint.config.cjs` / `eslint.config.mjs` 接入。
- 依赖类型信息的规则被拆分到了 `typed` / `react-typed` 中，避免基础配置在没有 parser services 时直接报错。
- 配置中启用了 `eslint-import-resolver-typescript`，如果项目使用 TypeScript，建议保证 `tsconfig.json` 位于项目根目录或能被 ESLint 正常解析。
- 由于 `eslint-plugin-import` 的已知限制，Flat Config 版本没有启用 `import/no-unused-modules`。
- React 配置默认使用 `react.version = detect`，会根据项目安装的 React 版本自动识别。
- 该配置对代码风格约束相对严格，首次接入旧项目时，可能需要分批修复现有告警。
