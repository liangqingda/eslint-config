# @liangqingda/eslint-config

This repository contains a shared ESLint configuration package for JavaScript, TypeScript, and React projects.

It provides:

- a base config exported from [`index.js`](/Users/lqd/projects/eslint-config/index.js)
- a React-focused config exported from [`react.js`](/Users/lqd/projects/eslint-config/react.js)
- a shared Prettier config in [`prettier.json`](/Users/lqd/projects/eslint-config/prettier.json)

The base config focuses on:

- general code quality rules from `eslint:recommended`
- TypeScript linting via `@typescript-eslint`
- import ordering and module hygiene
- Prettier compatibility
- a handful of opinionated style and safety rules

The React config builds on top of the base config and adds:

- React recommended rules
- React Hooks recommended rules
- JSX-specific style rules

## Packages Used

### Peer dependencies

These packages are expected to be provided by the project that consumes this config:

- `eslint`: the lint engine itself
- `prettier`: used as the dedicated formatter alongside ESLint
- `typescript`: needed for TypeScript-aware parsing and rules

### Runtime dependencies

These packages are installed by this repo because the exported ESLint configs depend on them directly:

- `@typescript-eslint/eslint-plugin`: TypeScript-specific lint rules such as unused vars, naming convention, and unsafe patterns
- `@typescript-eslint/parser`: lets ESLint parse TypeScript syntax
- `eslint-config-prettier`: turns off ESLint rules that would conflict with Prettier
- `eslint-import-resolver-typescript`: makes `eslint-plugin-import` understand TypeScript path resolution
- `eslint-plugin-import`: checks import/export correctness and enforces import ordering
- `eslint-plugin-n`: Node.js-related lint rules
- `eslint-plugin-no-secrets`: detects likely secrets or sensitive tokens committed into source code
- `eslint-plugin-promise`: lint rules for Promise usage and async code patterns
- `eslint-plugin-react`: React-specific lint rules
- `eslint-plugin-react-hooks`: lint rules for Hooks usage and dependency handling

## Repository Structure

- [`index.js`](/Users/lqd/projects/eslint-config/index.js): base ESLint config
- [`react.js`](/Users/lqd/projects/eslint-config/react.js): React extension config
- [`prettier.json`](/Users/lqd/projects/eslint-config/prettier.json): shared Prettier config
- [`package.json`](/Users/lqd/projects/eslint-config/package.json): package metadata and dependency declarations

## Notes

- The current package exports classic ESLint config modules via CommonJS.
- The dependency set has already been upgraded to the latest stable versions compatible with the current config layout.
- ESLint is used for code quality rules, while Prettier is kept as a separate formatter instead of running through ESLint.
- If this package later migrates to ESLint flat config, the README should be updated to document the new usage pattern.
