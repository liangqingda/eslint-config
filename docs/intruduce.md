# 配置介绍

这个包当前提供了 6 套 ESLint Flat Config 和 1 份共享 Prettier 配置，分别覆盖基础 JavaScript / TypeScript、需要类型信息的 TypeScript、Node.js ESM、Node.js + TypeScript + ESM、React，以及 React + TypeScript 类型检查场景。

另外，所有对外导出的 JS 入口文件都会在第一行添加用途注释，方便在仓库内直接打开文件时快速识别该入口对应的配置场景。

为了区分公共入口和内部实现，这些给外部使用的入口文件现在统一放在 [`exports/`](/Users/lqd/projects/eslint-config/exports) 目录中；包的导出路径本身没有变化。

## 一览

| 导出路径 | 适用场景 | 特点 |
| --- | --- | --- |
| `@liangqingda/eslint-config` | JavaScript 项目，或不想启用类型感知规则的 TypeScript 项目 | 基础规则集合，限制较完整 |
| `@liangqingda/eslint-config/typed` | 需要 TypeScript 类型检查规则的项目 | 在基础配置上开启依赖类型信息的规则 |
| `@liangqingda/eslint-config/node` | Node.js + JavaScript + ESM 项目 | 在基础配置上补充 Node.js ESM globals |
| `@liangqingda/eslint-config/node-typed` | Node.js + TypeScript + ESM 项目 | 组合了 Node 运行时环境和 Typed 规则 |
| `@liangqingda/eslint-config/react` | React 项目 | 在基础配置上增加 React / JSX 规则 |
| `@liangqingda/eslint-config/react-typed` | React + TypeScript 项目，且希望启用类型感知规则 | 组合了 React 规则和 Typed 规则 |
| `@liangqingda/eslint-config/prettier.json` | 所有需要统一格式化配置的项目 | 共享的 Prettier 配置 |

## 1. 基础配置 `@liangqingda/eslint-config`

入口文件是 [`exports/index.js`](/Users/lqd/projects/eslint-config/exports/index.js)，它会读取聚合层 [`configs.js`](/Users/lqd/projects/eslint-config/configs.js)；基础配置的实际实现位于 [`config/base.js`](/Users/lqd/projects/eslint-config/config/base.js) 里的 `baseConfig`。

这套配置适合作为默认起点，主要由 4 部分组成：

1. `@eslint/js` 的 `recommended`
2. `@typescript-eslint` 的 `flat/recommended`
3. `eslint-plugin-import` 的 `recommended`
4. `eslint-config-prettier`

在这些官方推荐配置之外，这个仓库还补充了大量自定义规则，重点包括下面几类。

### 1.1 安全与风险控制

- 启用了 `no-secrets/no-secrets`，会对疑似密钥、token、密码等内容报错。
- 禁止 `import/no-dynamic-require`，避免动态 `require`。
- 启用了 `import/no-cycle`，减少循环依赖问题。
- 启用了 `import/no-mutable-exports`，避免可变导出。

### 1.2 基础代码风格

- 强制分号：`semi: ["error", "always"]`
- 强制单引号：`quotes: ["error", "single"]`
- 强制使用严格相等：`eqeqeq`
- 强制使用花括号：`curly`
- 限制多余空行：`no-multiple-empty-lines`
- 强制对象花括号空格：`object-curly-spacing`
- 强制关键字和运算符空格：`keyword-spacing`、`space-infix-ops`
- 禁止尾随空格和多余空格：`no-trailing-spaces`、`no-multi-spaces`

### 1.3 语句结构与可读性

- `no-else-return`：如果前面已经 `return`，不允许再写多余的 `else`
- `prefer-destructuring`：鼓励解构赋值
- `prefer-template`：鼓励模板字符串
- `arrow-body-style`、`prefer-arrow-callback`：偏向箭头函数风格
- `padding-line-between-statements`：变量声明、导出语句，以及 `if` / `function` / `for` / `const fn = () => {}` 这类 block-like 语句前后必须保留空行
- `padded-blocks`：关闭代码块内部强制空行，改为只约束块外空行

### 1.4 对某些语法和写法的限制

- 禁止 `WithStatement`
- 禁止 `DoWhileStatement`
- 禁止传统 `ForStatement`
- 禁止 `ForInStatement`
- 禁止直接调用 `require(...)`，推荐改用 `import`
- 禁止调用常见的可变数组方法，如 `push`、`pop`、`splice`、`sort`、`reverse`

这说明这套配置整体偏向：

- 更函数式
- 更强调不可变数据
- 更强调统一代码结构

### 1.5 TypeScript 基础规则

即使使用的是基础配置，也已经包含不依赖类型信息的 TypeScript 规则，例如：

- 关闭原生 `no-unused-vars`，改用 `@typescript-eslint/no-unused-vars`
- 限制枚举命名必须使用大驼峰，并以 `Enum` 结尾，例如 `GroupEnum`
- 禁止 `any`：`@typescript-eslint/no-explicit-any`
- 要求重载签名相邻：`@typescript-eslint/adjacent-overload-signatures`
- 禁止显式写出可推断类型：`@typescript-eslint/no-inferrable-types`
- 限制方法签名风格：`@typescript-eslint/method-signature-style`

其中未使用变量规则还做了约定：

- 变量名为 `_` 可忽略
- 以 `_` 开头的参数可忽略

### 1.5.1 `constants/` 与 `consts/` 目录下的常量命名

所有导出配置都会额外约束一类目录内的变量命名：

- 只要文件路径命中 `constants/` 或 `consts/`
- 且变量是 `const` 声明
- 且初始化值不是函数声明表达式或箭头函数

那么变量名必须使用全大写下划线风格（`UPPER_CASE`）。

例如：

```js
const API_URL = 'https://example.com'; // 允许
const MAX_RETRY_COUNT = 3; // 允许

const apiUrl = 'https://example.com'; // 不允许
const retryCount = 3; // 不允许

const createClient = () => {}; // 允许
const fetchData = async function () {}; // 允许
function formatValue() {} // 允许
let localValue = 1; // 允许
```

这条规则的目标是把“常量目录”里的数据型常量命名统一起来，同时保留工厂函数、工具函数等函数型导出的常见写法。

### 1.6 Import 相关规则

基础配置对导入规范约束比较多：

- `import/first`：`import` 必须放在顶部
- `import/newline-after-import`：导入后必须空一行
- `import/order`：按 `builtin`、`external`、`type`、`internal`、相对路径分组
- `@/**` 会被视为 `internal`
- 启用了 `import/export`
- 启用了 `import/no-useless-path-segments`

同时还配置了 TypeScript 友好的 resolver：

- `node` resolver 支持 `.ts`、`.tsx`、`.js`、`.jsx`、`.mjs`、`.cjs`
- `typescript` resolver 已开启，方便识别 TS 路径和类型导入

### 1.7 全局变量限制

为了减少误用浏览器全局变量，额外禁止直接使用：

- `status`
- `name`
- `open`

如果确实需要这些含义，建议定义同名的局部变量替代全局访问。

## 2. 类型检查配置 `@liangqingda/eslint-config/typed`

入口文件是 [`exports/typed.js`](/Users/lqd/projects/eslint-config/exports/typed.js)，它会读取聚合层 `configs.js`；`typedConfig` 的实际实现位于 [`config/typed.js`](/Users/lqd/projects/eslint-config/config/typed.js)。

这套配置是在基础配置之上再增加一层类型感知规则，并开启：

```js
parserOptions: {
  projectService: true,
}
```

这意味着 ESLint 会尝试读取项目的 TypeScript 工程信息，因此更适合：

- 已经有 `tsconfig.json` 的项目
- 希望在 lint 阶段发现更多潜在类型问题的项目

额外增加的规则包括：

- `@typescript-eslint/no-for-in-array`
- `@typescript-eslint/no-unnecessary-condition`
- `@typescript-eslint/no-unnecessary-type-assertion`
- `@typescript-eslint/only-throw-error`
- `@typescript-eslint/switch-exhaustiveness-check`

另外还显式关闭了原生 `no-throw-literal`，交给 `@typescript-eslint/only-throw-error` 统一处理。

## 3. Node 配置 `@liangqingda/eslint-config/node`

入口文件是 [`exports/node.js`](/Users/lqd/projects/eslint-config/exports/node.js)，它会读取聚合层 `configs.js`；`nodeConfig` 的实际实现位于 [`config/node.js`](/Users/lqd/projects/eslint-config/config/node.js)。

这套配置是在基础配置之上补充了适用于 Node.js ESM 运行时的环境：

- `languageOptions.sourceType = "module"`
- 内置 `globals.nodeBuiltin`
- 通过 `eslint-plugin-check-file` 强制文件名和目录名使用 `kebab-case`

因此更适合：

- Node.js + JavaScript + ESM 项目
- 直接使用 `process`、`Buffer`、`console` 等 Node 运行时全局变量的后端项目

这套配置没有加入 CommonJS 风格的 `require`、`module`、`__dirname`、`__filename` 全局，因此更贴近当前仓库面向的 ESM 使用方式。

除此之外，Node 配置还会额外约束命名风格：

- 文件名必须使用中划线形式，例如 `api-key.ts`
- 目录名必须使用中划线形式，例如 `user-service/`
- 对 `api-key.test.ts`、`user-service.spec.ts` 这类带中间扩展名的文件，会按主文件名部分继续检查 `kebab-case`
- 如果文件位于 `constants/` 或 `consts/` 目录中，非函数值的 `const` 变量必须使用 `UPPER_CASE`

## 4. Node Typed 配置 `@liangqingda/eslint-config/node-typed`

入口文件是 [`exports/node-typed.js`](/Users/lqd/projects/eslint-config/exports/node-typed.js)，它会读取聚合层 `configs.js`；`nodeTypedConfig` 的实际实现位于 [`config/node.js`](/Users/lqd/projects/eslint-config/config/node.js)。

它本质上是下面两者的组合：

- Node 配置
- Typed 配置

也就是说，这套配置同时具备：

- 基础 JavaScript / TypeScript 规则
- Node.js ESM 运行时 globals
- 依赖类型信息的 TypeScript 规则
- 文件名和目录名的中划线命名约束

如果你的项目是 Node.js + TypeScript，并且希望把类型相关问题直接纳入 ESLint，这是后端项目里最完整的一套配置。

## 5. React 配置 `@liangqingda/eslint-config/react`

入口文件是 [`exports/react.js`](/Users/lqd/projects/eslint-config/exports/react.js)，它会读取聚合层 `configs.js`；`reactConfig` 的实际实现位于 [`config/react.js`](/Users/lqd/projects/eslint-config/config/react.js)。

这套配置在基础配置之上又叠加了：

1. `eslint-plugin-react` 的 `flat.recommended`
2. `eslint-plugin-react` 的 `flat["jsx-runtime"]`
3. `eslint-plugin-react-hooks` 的 `recommended`

同时配置了：

```js
settings: {
  react: {
    version: "detect",
  },
}
```

也就是会自动识别项目安装的 React 版本。

### 5.1 React 规则增强

React 配置中增加或强化了下面这些规则：

- `react/self-closing-comp`
- `react/jsx-wrap-multilines`
- `react/jsx-pascal-case`
- `react/jsx-tag-spacing`
- `react/jsx-sort-props`
- `react/jsx-boolean-value`
- `react/no-array-index-key`
- `react/jsx-no-bind`
- `react/jsx-curly-brace-presence`
- `react/destructuring-assignment`
- `react/no-deprecated`

另外，React 配置在基础语法限制之外，额外增加了一条针对 `<img>` 的 `no-restricted-syntax` 限制；而当文件位于 `constants/`、`consts/` 目录时，这两类限制会一起生效：

同时关闭了部分在现代 React 项目里不太需要的规则：

- `react/prop-types: off`
- `react/jsx-uses-react: off`
- `react/react-in-jsx-scope: off`
- `react/display-name: off`

### 5.2 React 项目的额外约束

除了 React 插件本身，这套配置还追加了一些偏 React 场景的约束：

- `max-lines` 限制单文件最多 490 行，注释不计入
- `arrow-parens` 要求箭头函数参数始终带括号
- `import/no-duplicates` 开启
- React 项目命名规则会按目录语义区分：
  - 所有目录默认使用中划线命名（`kebab-case`）
  - 所有非 `tsx` 文件默认使用中划线命名（`kebab-case`）
  - 只有直接位于 `hooks/`、`store/` 目录下的根文件，才允许并且要求使用以 `use` 开头的小驼峰命名（`camelCase`）
  - `components/`、`utils/`、`types/`、`hooks/`、`store/`、`constants/`、`consts/` 这几个目录名本身无论出现在任何位置都始终合法
  - `pages/`、`components/`、`layouts/` 这几个目录里继续嵌套的目录，默认必须使用大驼峰命名（`PascalCase`）
  - `utils/`、`types/`、`hooks/`、`store/`、`constants/`、`consts/` 这几个目录里继续嵌套的目录，默认必须使用中划线命名（`kebab-case`）
  - `pages/`、`components/`、`layouts/` 目录树中的 `tsx` 文件，除 `index.tsx` 外必须使用大驼峰命名（`PascalCase`）

导入顺序也做了额外处理：

- `*.less`、`*.css`、`*.scss` 会被视为相对导入，并排在后面
- `@/**` 仍然被视为内部模块

### 5.3 JSX 中的特殊限制

React 配置还扩展了 `no-restricted-syntax`，新增了一条针对 `<img>` 的限制：

- 不允许在 `<img src={...}>` 里直接写字面量或复杂表达式
- 更推荐先 `import` 资源，再把变量传给 `src`

## 6. React Typed 配置 `@liangqingda/eslint-config/react-typed`

入口文件是 [`exports/react-typed.js`](/Users/lqd/projects/eslint-config/exports/react-typed.js)，它会读取聚合层 `configs.js`；`reactTypedConfig` 的实际实现位于 [`config/react.js`](/Users/lqd/projects/eslint-config/config/react.js)。

它本质上是下面两者的组合：

- React 配置
- Typed 配置

也就是说，这套配置同时具备：

- 基础 JavaScript / TypeScript 规则
- React / Hooks / JSX 规则
- 依赖类型信息的 TypeScript 规则

## 7. Prettier 配置 `@liangqingda/eslint-config/prettier.json`

共享配置文件的实际入口是 [`exports/prettier.js`](/Users/lqd/projects/eslint-config/exports/prettier.js)，但对外导出路径仍然是 `@liangqingda/eslint-config/prettier.json`。

当前内容包括：

- `singleQuote: true`
- `trailingComma: "all"`
- `printWidth: 100`
- `semi: true`
- `tabWidth: 2`

另外还对 `.prettierrc` 做了覆盖：

- 当文件名是 `.prettierrc` 时，强制按 `json` 解析

## 8. 该怎么选

可以按下面的方式选择：

- 纯 JavaScript 项目：使用 `@liangqingda/eslint-config`
- TypeScript 项目，但暂时不想启用类型感知 lint：使用 `@liangqingda/eslint-config`
- TypeScript 项目，需要更严格的类型规则：使用 `@liangqingda/eslint-config/typed`
- Node.js + JavaScript + ESM 项目：使用 `@liangqingda/eslint-config/node`
- Node.js + TypeScript + ESM 项目：使用 `@liangqingda/eslint-config/node-typed`
- React + JavaScript 项目：使用 `@liangqingda/eslint-config/react`
- React + TypeScript 项目，需要类型感知规则：使用 `@liangqingda/eslint-config/react-typed`
