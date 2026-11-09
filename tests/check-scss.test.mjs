/**
 * `liangqingda-check-scss` 的回归测试：每条检查项各一个反例 + 一个正例，
 * 确认「排版」与「类名」两类规则真的会拦。用临时目录跑真实 CLI，不依赖仓库内文件。
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const BIN = path.resolve(fileURLToPath(new URL('../bin/check-scss.mjs', import.meta.url)));

/** 在临时目录里写一份 src/a.scss 并跑 CLI，返回 { status, stderr } */
function run(source) {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-scss-'));

  try {
    mkdirSync(path.join(dir, 'src'), { recursive: true });
    writeFileSync(path.join(dir, 'src/a.scss'), source, 'utf8');

    const result = spawnSync(process.execPath, [BIN, 'src'], { cwd: dir, encoding: 'utf8' });

    return { stderr: result.stderr, status: result.status };
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
}

test('camelCase 文件通过', () => {
  const { status } = run([
    '.cardTitle {',
    '  color: red;',
    '}',
    '',
    '.cardBody {',
    '  padding: 0.5rem;',
    '}',
    '',
  ].join('\n'));

  assert.equal(status, 0);
});

test('kebab-case 文件通过', () => {
  const { status } = run([
    '.card-title {',
    '  color: red;',
    '}',
    '',
    '.card-body {',
    '  padding: 4px;',
    '}',
    '',
  ].join('\n'));

  assert.equal(status, 0);
});

test('中文类名被拦', () => {
  const { status, stderr } = run('.标题 {\n  color: red;\n}\n');

  assert.equal(status, 1);
  assert.match(stderr, /非 ASCII/);
});

test('下划线类名被拦', () => {
  const { status, stderr } = run('.card_title {\n  color: red;\n}\n');

  assert.equal(status, 1);
  assert.match(stderr, /下划线/);
});

test('数字开头类名被拦', () => {
  const { status, stderr } = run('.2col {\n  color: red;\n}\n');

  assert.equal(status, 1);
  assert.match(stderr, /不能以数字或连字符开头/);
});

test('同一文件混用两种风格被拦', () => {
  const { status, stderr } = run([
    '.card-title {',
    '  color: red;',
    '}',
    '',
    '.cardBody {',
    '  color: blue;',
    '}',
    '',
  ].join('\n'));

  assert.equal(status, 1);
  assert.match(stderr, /混用 kebab-case/);
});

test('块间缺少空行仍被拦（排版回归）', () => {
  const { status, stderr } = run('.a {\n  color: red;\n}\n.b {\n  color: blue;\n}\n');

  assert.equal(status, 1);
  assert.match(stderr, /块间缺少空行/);
});

test('at-rule 与伪类不误报', () => {
  const { status } = run([
    '@media (min-width: 100px) {',
    '  .card {',
    '    color: red;',
    '',
    '    &:hover {',
    '      color: blue;',
    '    }',
    '  }',
    '}',
    '',
  ].join('\n'));

  assert.equal(status, 0);
});
