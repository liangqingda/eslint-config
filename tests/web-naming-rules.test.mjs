/**
 * 命名规则的回归测试：重点覆盖「components/ 下一层分类分组目录允许小写」这条，
 * 以及它不会放开更深层组件目录的大驼峰要求。用 ESLint 的 Linter 直接跑插件规则，
 * 不落盘、不依赖仓库内文件。
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Linter } from 'eslint';

import webNamingRulesModule from '../config/web-naming-rules.js';

const { webNamingPlugin } = webNamingRulesModule;
const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const FOLDER_RULE = 'liangqingda-react/folder-naming-convention';
const FILE_RULE = 'liangqingda-react/filename-naming-convention';

/** 用插件规则检查一条相对仓库根的路径，返回命中的消息 */
function lint(relativePath) {
  const linter = new Linter();
  const filename = path.join(ROOT, ...relativePath.split('/'));

  const messages = linter.verify(
    'export const a = 1;\n',
    {
      files: ['**/*.{ts,tsx}'],
      plugins: { 'liangqingda-react': webNamingPlugin },
      rules: {
        [FILE_RULE]: 'error',
        [FOLDER_RULE]: 'error',
      },
    },
    filename,
  );

  return messages.filter((message) => !message.fatal);
}

/** 断言某条路径命名合法 */
function assertValid(relativePath) {
  assert.deepEqual(lint(relativePath), [], relativePath);
}

/** 断言某条路径至少命中一条指定规则的错误 */
function assertInvalid(relativePath, ruleId) {
  const messages = lint(relativePath);

  assert.ok(
    messages.some((message) => message.ruleId === ruleId),
    `${relativePath} 应命中 ${ruleId}，实际：${JSON.stringify(messages)}`,
  );
}

test('components 下的分类分组目录允许小写', () => {
  assertValid('src/components/modals/FreeModal/index.tsx');
  assertValid('src/components/fields/FreeSelectField/utils/a-b.ts');
  assertValid('src/components/file-preview/FreeVideo/index.tsx');
  assertValid('src/components/tables/FreeTable/index.tsx');
});

test('不在分类名单里的小写目录仍然算漏写大驼峰', () => {
  assertInvalid('src/components/free-modal/index.tsx', FOLDER_RULE);
});

test('直接挂在 components 下的组件目录仍用大驼峰', () => {
  assertValid('src/components/FreeModal/index.tsx');
  assertInvalid('src/components/free-modal/index.tsx', FOLDER_RULE);
});

test('分类分组目录的后代仍要求大驼峰', () => {
  assertInvalid('src/components/modals/free-modal/index.tsx', FOLDER_RULE);
  assertInvalid('src/components/modals/FreeModal/utils/AA/a.ts', FOLDER_RULE);
  assertValid('src/components/modals/FreeModal/utils/aa-bb.ts');
});

test('pages 下同名的 components 分组目录同样放行', () => {
  assertValid('src/pages/English/components/modals/NotePreviewModal/index.tsx');
  assertInvalid(
    'src/pages/English/components/modals/note-preview-modal/index.tsx',
    FOLDER_RULE,
  );
});
