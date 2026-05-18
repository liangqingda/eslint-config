# VS Code 中如何使用 `@liangqingda/eslint-config`

这份文档专门说明如何在 VS Code 里让 ESLint 在编码阶段就实时提示问题，而不是只有在命令行执行 `eslint` 或 `eslint --fix` 时才看到报错和警告。

适用目标：

- 在编辑器里实时看到 `error` 和 `warn`
- 保存文件时自动执行 ESLint 修复
- 在 React 项目中及时看到 `react-hooks/exhaustive-deps` 这类 Hooks 依赖提示

## 1. 先确认项目本身已经接入 ESLint

VS Code 里的提示，本质上依赖项目本身可以正常运行 ESLint。

也就是说，你的项目里至少需要：

- 已安装 `eslint`
- 已安装并接入 `@liangqingda/eslint-config`
- 根目录存在 `eslint.config.js`、`eslint.config.cjs` 或 `eslint.config.mjs`

例如 React + TypeScript 项目：

```js
const reactTypedConfig = require('@liangqingda/eslint-config/react-typed');

module.exports = [...reactTypedConfig];
```

如果你的项目在命令行里执行 `npx eslint .` 都无法正常工作，那么 VS Code 里通常也不会正常提示。

## 2. 安装 VS Code 官方 ESLint 扩展

在 VS Code 扩展市场中安装官方 ESLint 扩展：

- 扩展名：`ESLint`
- 发布者：`Microsoft`
- 扩展 ID：`dbaeumer.vscode-eslint`

安装完成后，建议重载一次 VS Code 窗口。

## 3. 推荐的 VS Code 工作区配置

建议在项目根目录创建 `.vscode/settings.json`，或者在你的用户设置里加入下面这份配置：

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

这几个配置分别表示：

- `eslint.validate`：告诉 VS Code 这些语言类型要交给 ESLint 检查
- `eslint.format.enable: false`：避免把 ESLint 当作纯格式化工具，减少和 Prettier 的职责混淆
- `editor.codeActionsOnSave.source.fixAll.eslint`：保存时执行 ESLint 可自动修复的问题

如果你希望保存时自动修复行为更激进，也可以把 `"explicit"` 改成 `true`：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 4. 如何在编码时看到实时提示

完成上面的配置后，VS Code 在你编辑文件时就会通过 ESLint 执行检查。

这意味着下面这些问题通常不需要等到命令行执行时才发现：

- 未使用变量
- 导入顺序错误
- React JSX 规则问题
- Hooks 使用方式错误
- Hooks 依赖数组不完整

例如在 React 配置中，`eslint-plugin-react-hooks` 已经内置到了这套配置里，因此像下面这类问题会在编辑器里直接提示：

- `useEffect`
- `useMemo`
- `useCallback`

对应的规则名一般是：

- `react-hooks/rules-of-hooks`
- `react-hooks/exhaustive-deps`

其中 `react-hooks/exhaustive-deps` 就是检查依赖数组是否遗漏依赖的规则。

## 5. Flat Config 项目的注意事项

`@liangqingda/eslint-config` 导出的是 ESLint Flat Config。

所以使用方项目需要满足下面几点：

- 使用 `eslint.config.js`、`eslint.config.cjs` 或 `eslint.config.mjs`
- 不要继续沿用 `.eslintrc` 风格的 `extends`
- 项目依赖中的 ESLint 版本需要与 Flat Config 用法兼容

如果你打开项目后 VS Code 没有任何 ESLint 提示，第一步就先确认项目根目录是否真的存在 `eslint.config.*` 文件。

## 6. TypeScript 项目的额外注意事项

如果你使用的是：

- `@liangqingda/eslint-config/typed`
- `@liangqingda/eslint-config/node-typed`
- `@liangqingda/eslint-config/react-typed`

那么这些配置依赖 TypeScript 工程信息，因此还需要：

- 项目里存在可识别的 `tsconfig.json`
- 如果是 monorepo，要保证 ESLint 能找到对应的 TypeScript 工程

如果这里配置不完整，VS Code 中可能会出现：

- 部分 TypeScript 规则不生效
- ESLint Server 启动失败
- 打开 TS/TSX 文件后没有任何类型相关提示

## 7. 如果编辑器里还是没有提示，怎么排查

可以按下面顺序检查：

1. 在项目根目录执行 `npx eslint .`
2. 确认 VS Code 已安装并启用 `dbaeumer.vscode-eslint`
3. 确认当前文件类型在 `eslint.validate` 中
4. 确认项目根目录存在 `eslint.config.*`
5. 如果是 typed 配置，确认 `tsconfig.json` 存在且可被识别
6. 打开 VS Code 的 Output 面板，查看 `ESLint` 日志

如果命令行能报错，但 VS Code 没提示，通常问题集中在下面几类：

- ESLint 扩展未启用
- 工作区目录打开错了
- monorepo 没配置 `eslint.workingDirectories`
- 当前文件没有被 `eslint.validate` 覆盖

## 8. 推荐的最小可用配置

如果你只想先尽快跑通，通常下面这份 `.vscode/settings.json` 就够用了：

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

配合项目根目录里的 `eslint.config.js` 使用后，绝大多数 React / TypeScript 项目都能在编码时看到 ESLint 提示。
