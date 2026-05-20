# Web 命名规则

本文专门说明 [`config/web-naming-rules.js`](/Users/lqd/projects/eslint-config/config/web-naming-rules.js) 中定义的 Web 命名规则。

这个实现文件当前按“顶层命名语义常量 + 辅助判断函数 + ESLint 插件导出”的方式组织，便于集中维护目录语义与文件命名策略。

其中有一条单独的全局限制需要特别注意：只要主文件名使用了大驼峰命名（`PascalCase`），扩展名就只能是 `jsx`、`tsx`、`vue`。

当前这套命名规则主要被下面两个配置复用：

- `@liangqingda/eslint-config/react`
- `@liangqingda/eslint-config/react-typed`

## 1. 适用范围

这套规则只检查脚本文件与目录名，当前支持的文件扩展名包括：

- `.js`
- `.jsx`
- `.mjs`
- `.cjs`
- `.ts`
- `.tsx`
- `.vue`
- `.mts`
- `.cts`

其他类型文件不会进入这套命名校验。

另外，文件名校验只看第一个 `.` 之前的主文件名，例如：

- `user-card.tsx` 会检查 `user-card`
- `api-key.test.ts` 会检查 `api-key`
- `use-user.spec.ts` 会检查 `use-user`

## 2. 默认规则

如果没有命中特殊目录语义：

- 所有目录默认要求使用中划线命名（`kebab-case`）
- 所有非 `tsx` / `vue` 文件默认要求使用中划线命名（`kebab-case`）

例如：

- `src/user-service.ts` 合法
- `src/userService.ts` 不合法
- `src/user-center/order-list.ts` 合法
- `src/user-center/OrderList.ts` 不合法

## 3. 语义目录名

下面这些目录名本身，无论出现在任何位置，都始终合法：

- `components`
- `layouts`
- `utils`
- `types`
- `hooks`
- `store`
- `constants`
- `consts`

这里的“目录名本身始终合法”指的是：即使当前所在目录树默认要求 `PascalCase` 或 `kebab-case`，这些语义目录名也允许直接写成固定的小写形式。

例如：

- `src/pages/Home/components/Profile/CardItem.tsx` 中的 `components` 合法
- `src/layouts/MainLayout/types/user-profile.ts` 中的 `layouts`、`types` 都合法

## 4. `pages` / `views` / `components` / `layouts` 目录树

当路径进入下面任意目录后：

- `pages`
- `views`
- `components`
- `layouts`

从该层开始，后续继续嵌套的后代目录默认都要求使用大驼峰命名（`PascalCase`）。

例如：

- `src/pages/Home/Profile/index.tsx` 合法
- `src/views/Home/Profile.vue` 合法
- `src/components/UserCard/Header.tsx` 合法
- `src/layouts/MainLayout/TopBar.tsx` 合法
- `src/pages/home/Profile/index.tsx` 不合法
- `src/views/home/Profile.vue` 不合法
- `src/components/user-card/Header.tsx` 不合法

需要注意的是，这里说的是“后代目录默认要求 `PascalCase`”。如果后续又进入了 `utils`、`types`、`hooks`、`store`、`constants`、`consts`，则会切换到另一套目录规则，见下一节。

## 5. `utils` / `types` / `hooks` / `store` / `constants` / `consts` 目录树

当路径进入下面任意目录后：

- `utils`
- `types`
- `hooks`
- `store`
- `constants`
- `consts`

从该层开始，后续继续嵌套的后代目录默认都要求使用中划线命名（`kebab-case`）。

例如：

- `src/pages/Home/utils/user-service/fetch-user.ts` 合法
- `src/pages/Home/types/user-profile/type-guards.ts` 合法
- `src/hooks/utils/a-b/test-a.ts` 合法
- `src/store/order-cache/get-item.ts` 合法
- `src/pages/Home/utils/UserService/fetch-user.ts` 不合法
- `src/store/OrderCache/get-item.ts` 不合法

## 6. 全局 PascalCase 文件限制

无论文件位于哪个目录，只要主文件名使用了大驼峰命名（`PascalCase`）：

- 扩展名就只能是 `jsx`、`tsx`、`vue`

例如：

- `src/UserCard.tsx` 合法
- `src/UserCard.jsx` 合法
- `src/views/Home/UserCard.vue` 合法
- `src/UserCard.ts` 不合法
- `src/UserCard.js` 不合法

这条限制是全局生效的，并不只针对 `pages`、`views`、`components`、`layouts` 目录树。

## 7. 大驼峰根目录下的文件规则

如果文件位于 `pages`、`views`、`components`、`layouts` 目录树内：

- 只有 `jsx`、`tsx`、`vue` 文件默认必须使用大驼峰命名（`PascalCase`）
- 但下面这些主文件名允许直接保留当前写法：
  - `utils`
  - `index`
  - `types`
  - `hooks`
  - `consts`
  - `constants`
  - `store`

例如：

- `src/pages/Home/index.tsx` 合法
- `src/views/Home/index.vue` 合法
- `src/pages/Home/UserCard.tsx` 合法
- `src/pages/Home/user-card.ts` 合法
- `src/views/Home/UserCard.vue` 合法
- `src/pages/Home/UserCard.jsx` 合法
- `src/components/UserCard/Header.tsx` 合法
- `src/pages/Home/utils.ts` 合法
- `src/pages/Home/store.ts` 合法
- `src/pages/Home/user-card.tsx` 不合法
- `src/pages/Home/UserCard.ts` 不合法
- `src/views/Home/user-card.vue` 不合法

也就是说，在这些大驼峰根目录树下，只有 `jsx`、`tsx`、`vue` 文件会被进一步要求使用大驼峰命名；普通 `ts`、`js` 文件仍然按各自规则校验，除非主文件名命中上述例外名单。

## 8. `hooks` / `store` 根文件规则

只有直接位于下面目录下的根文件：

- `hooks`
- `store`

才允许并且要求使用以 `use` 开头的小驼峰命名（`camelCase`），例如：

- `src/hooks/useUser.ts`
- `src/store/useOrder.ts`

这条规则只看“直接父目录”：

- `src/hooks/useTest.ts` 合法
- `src/hooks/test-a.ts` 不合法
- `src/store/useUser.ts` 合法
- `src/store/user.ts` 不合法

如果文件已经进入了 `hooks` / `store` 的子目录中，就不再按 `useXxx` 规则处理，而是回到目录树自己的常规规则：

- `src/hooks/utils/test-a.ts` 合法
- `src/hooks/utils/a-b/a.ts` 合法
- `src/store/user-cache/test-a.ts` 合法
- `src/utils/use-user.ts` 不合法

也就是说：

- `useXxx` 只适用于 `hooks/`、`store/` 目录下的根文件
- 其他位置的文件名不应该使用 `useXxx`

## 9. 常见合法示例

- `src/UserCard.tsx`
- `src/pages/Home/components/Profile/CardItem.tsx`
- `src/views/Home/Profile.vue`
- `src/pages/Home/profile.ts`
- `src/pages/Home/components/utils/user-service/fetch-user.ts`
- `src/pages/Home/layouts/MainLayout/index.tsx`
- `src/pages/Home/store.ts`
- `src/pages/Home/types/user-profile/type-guards.ts`
- `src/hooks/useTest.ts`
- `src/hooks/utils/test-a.ts`
- `src/hooks/utils/a-b/a.ts`
- `src/store/useUser.ts`
- `src/store/order-cache/get-item.ts`
- `src/features/order/constants/api-config.ts`

## 10. 常见不合法示例

- `src/UserCard.ts`
- `src/pages/home/components/Profile/CardItem.tsx`
- `src/views/home/Profile.vue`
- `src/pages/Home/components/profile/CardItem.tsx`
- `src/pages/Home/UserCard.ts`
- `src/pages/Home/types/UserProfile/type-guards.ts`
- `src/pages/Home/utils/UserService/fetch-user.ts`
- `src/hooks/test-a.ts`
- `src/store/user.ts`
- `src/utils/use-user.ts`

## 11. 与常量命名规则的关系

`constants/`、`consts/` 在这套 Web 命名规则里有两层含义：

- 目录名本身始终合法
- 进入该目录后，后代目录默认要求使用中划线命名（`kebab-case`）

除此之外，仓库里还有一条独立的常量命名规则：

- 只要文件位于 `constants/` 或 `consts/` 目录中
- 非函数值的 `const` 变量必须使用全大写下划线命名（`UPPER_CASE`）

例如：

- `const API_URL = '...'` 合法
- `const apiUrl = '...'` 不合法

这条规则不是 `web-naming-rules.js` 里的文件/目录命名检查，而是共享配置中的另一条独立规则；两者会同时生效。
