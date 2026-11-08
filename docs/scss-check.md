# SCSS 排版检查 `liangqingda-check-scss`

ESLint 只处理 `.js` / `.ts` / `.tsx`，样式文件的排版没有任何工具兜底。这个包自带一个
**零依赖**校验脚本，把「样式块之间必须空行隔离」这类排版要求跨项目复用。

## 为什么不是 stylelint

stylelint 能覆盖同样的规则，但需要项目额外安装 `stylelint` + 共享配置，并且要单独接一条
命令。这个脚本零依赖、随 `@liangqingda/eslint-config` 一起装好，适合只想「保证块间空行、
别把选择器列表写断」的项目。需要更完整的样式规范（颜色写法、属性次序、禁用规则等）时，
再考虑引入 stylelint。

## 用法

安装本包后直接用 bin：

```bash
liangqingda-check-scss            # 默认检查 ./src
liangqingda-check-scss src app   # 检查多个目录
liangqingda-check-scss --all      # 检查当前目录下所有 scss / css
```

接到 `lint` 流程里：

```json
{
  "scripts": {
    "lint": "eslint . && liangqingda-check-scss src"
  }
}
```

## 检查项

1. **块间缺少空行**：上一块以 `}` 结束、下一行又开始新块（以 `{` 结尾）时，中间至少要空一行。
2. **选择器列表被空行截断**：`.a,` 和 `.b {` 之间插空行不会让 Sass 报错，但会让人误以为它们
   是两个块，后续按「`}` 后空行」拆文件就会拆错。
3. **连续多个空行**：两块之间只留一个空行。
4. **行尾空格**。
5. **文件末尾缺少换行**，或末尾多出空行。

注释内部不参与判断：块注释里出现 `}` 或 `,` 属正常写法，不会被误报。

## 边界

- 只做排版，不做语义检查（嵌套层级、变量作用域、`!important` 之类不在范围内）。
- 扫描 `.scss` 与 `.css`，自动跳过 `node_modules`、`dist`、`build`、`coverage`、`.git`、
  `.next`、`.output`。
- 输出路径相对执行时的工作目录，便于在 CI 里定位。
