#!/usr/bin/env node
/**
 * @liangqingda/eslint-config — SCSS 排版检查（零依赖 CLI）
 *
 * ESLint 只处理 .js/.ts/.tsx，样式文件的排版没有任何工具兜底，所以把这条排版要求
 * 做成一个可跨项目复用的零依赖脚本：
 *  1. 块与块之间必须有空行：上一块以 `}` 结束、下一行又开始新块（以 `{` 结尾）时，
 *     中间至少要空一行，否则整份样式挤成一坨、diff 也看不出边界。
 *  2. 选择器列表内不得有空行：`.a,` 与 `.b {` 之间插空行不会报错（Sass 仍按同一个
 *     列表编译），但会让人误以为它们是两个块，后续按「} 后空行」拆文件就会拆错。
 *  3. 不允许连续多个空行、行尾空格、文件末尾缺少换行或尾部多空行。
 *
 * 注释块内部不参与判断（文档注释里出现 `}` 或 `,` 属正常写法）。
 *
 * 用法：
 *   liangqingda-check-scss            # 默认检查当前目录下的 src
 *   liangqingda-check-scss src app   # 检查多个目录
 *   liangqingda-check-scss --all      # 检查当前目录下所有 scss/css（跳过 node_modules 等）
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CODE_EXTS = new Set(['.scss', '.css']);
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.next',
  '.output',
]);

const args = process.argv.slice(2);
const all = args.includes('--all');
const targets = args.filter((arg) => !arg.startsWith('-'));
const roots = all || targets.length === 0 ? (all ? ['.'] : ['src']) : targets;

const errors = [];

/** 收集目录下所有样式文件（递归，跳过依赖与产物目录） */
function collectFiles(dir, out = []) {
  let stat;

  try {
    stat = statSync(dir);
  } catch {
    return out;
  }

  if (stat.isFile()) {
    if (CODE_EXTS.has(path.extname(dir))) out.push(dir);

    return out;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) collectFiles(abs, out);
    } else if (CODE_EXTS.has(path.extname(entry.name))) {
      out.push(abs);
    }
  }

  return out;
}

/**
 * 把文件切成「代码行」序列：注释整段剔除，避免文档注释里的符号被当成语法。
 * 返回 { line, text, isBlank }，line 是原始行号（1 起）。
 */
function toCodeLines(source) {
  const lines = source.split('\n');
  const result = [];
  let inBlockComment = false;

  lines.forEach((raw, index) => {
    const text = raw.trim();

    if (inBlockComment) {
      if (text.includes('*/')) inBlockComment = false;

      return;
    }

    if (text.startsWith('/*') && !text.includes('*/')) {
      inBlockComment = true;

      return;
    }

    if (text.startsWith('/*') || text.startsWith('//')) return;

    result.push({ isBlank: text === '', line: index + 1, text });
  });

  return result;
}

/** 判断一行是否开启一个新块（选择器 / at-rule 收尾是 `{`） */
const opensBlock = (text) => text.endsWith('{');

/** 判断一行是否结束一个块 */
const closesBlock = (text) => text === '}' || text.endsWith('}');

function checkFile(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const source = readFileSync(file, 'utf8');

  if (!source.endsWith('\n')) {
    errors.push(`${rel}: 文件末尾缺少换行`);
  }

  if (source.endsWith('\n\n')) {
    errors.push(`${rel}: 文件末尾多了空行`);
  }

  source.split('\n').forEach((raw, index) => {
    if (/\s+$/u.test(raw) && raw.trim() !== '') {
      errors.push(`${rel}:${index + 1} 行尾有多余空格`);
    }
  });

  const lines = toCodeLines(source);

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index];

    if (current.isBlank) {
      const previous = lines[index - 1];

      // 连续空行：两块之间只留一个空行
      if (previous && previous.isBlank) {
        errors.push(`${rel}:${current.line} 连续多个空行`);
      }

      // 选择器列表被空行截断
      if (previous && previous.text.endsWith(',')) {
        errors.push(
          `${rel}:${previous.line} 选择器列表被空行截断（"${previous.text}" 与下一行属同一个块，删掉中间的空行）`,
        );
      }

      continue;
    }

    const next = lines[index + 1];

    if (!next || next.isBlank) continue;

    // 上一行结束了一个块、下一行又开始新块：中间必须有空行
    if (closesBlock(current.text) && opensBlock(next.text)) {
      errors.push(
        `${rel}:${current.line} 块间缺少空行（"${current.text}" 与第 ${next.line} 行的 "${next.text}" 之间要空一行）`,
      );
    }
  }
}

const files = roots.flatMap((root) => collectFiles(path.resolve(ROOT, root)));

for (const file of files) checkFile(file);

if (errors.length > 0) {
  console.error('[×] SCSS 排版检查未通过：');

  for (const message of errors) console.error(`  ${message}`);

  process.exit(1);
}

console.log(
  `[✓] SCSS 排版检查通过：${files.length} 个样式文件块间均有空行`,
);
