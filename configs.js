const js = require("@eslint/js");
const tsEslint = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const noSecretsPlugin = require("eslint-plugin-no-secrets");
const prettierConfig = require("eslint-config-prettier");

const importExtensions = [
  ".ts",
  ".cts",
  ".mts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
];

const baseSettings = {
  "import/extensions": importExtensions,
  "import/external-module-folders": ["node_modules", "node_modules/@types"],
  "import/parsers": {
    "@typescript-eslint/parser": [".ts", ".cts", ".mts", ".tsx"],
  },
  "import/resolver": {
    node: {
      extensions: importExtensions,
    },
    typescript: {},
  },
};

const baseRules = {
  "no-secrets/no-secrets": ["error", { tolerance: 5 }],
  "no-else-return": ["error", { allowElseIf: false }],
  "import/first": "error",
  "import/newline-after-import": "error",
  "no-return-assign": ["error", "always"],
  "no-console": ["error", { allow: ["info", "warn", "error"] }],

  // Opinionated
  "import/named": "off",
  "import/no-named-as-default-member": "off",
  semi: ["error", "always"],
  eqeqeq: "error",
  curly: "error",
  "prefer-destructuring": "error",
  // Removing Redundancy
  "no-extra-bind": "error",
  "no-extra-label": "error",
  "no-useless-call": "error",
  // Comment
  "spaced-comment": "error",
  "multiline-comment-style": "error",
  // String
  quotes: [
    "error",
    "single",
    { avoidEscape: true, allowTemplateLiterals: false },
  ],
  "prefer-template": "error",
  // Empty Line
  "no-multiple-empty-lines": [
    "error",
    {
      max: 1,
    },
  ],
  "padding-line-between-statements": [
    "error",
    {
      blankLine: "always",
      prev: ["var", "const", "let", "class"],
      next: "*",
    },
    {
      blankLine: "any",
      prev: ["const", "let", "var"],
      next: ["const", "let", "var"],
    },
    { blankLine: "always", prev: "*", next: "export" },
  ],
  "padded-blocks": ["error", "always"],
  // Function
  "arrow-body-style": "error",
  "prefer-arrow-callback": "error",
  "no-param-reassign": [
    "error",
    {
      props: true,
    },
  ],
  "no-loop-func": "error",
  "no-await-in-loop": "error",
  "no-restricted-syntax": [
    "error",
    "WithStatement",
    "DoWhileStatement",
    "ForStatement",
    "ForInStatement",
    {
      selector: "CallExpression[callee.name='require']",
      message: "require is not recommended, use import instead.",
    },
    {
      selector:
        "CallExpression[callee.type='MemberExpression'] MemberExpression[property.name=/^(copyWithin|fill|pop|push|reverse|shift|sort|splice|unshift)$/]",
      message: "DO NOT CALL MUTATING FUNCTION, THANKS.",
    },
  ],
  // Spacing
  "object-curly-spacing": ["error", "always"],
  "key-spacing": [
    "error",
    {
      afterColon: true,
    },
  ],
  "keyword-spacing": "error",
  "no-trailing-spaces": "error",
  "no-multi-spaces": "error",
  "space-infix-ops": "error",
  "space-in-parens": "error",
  "space-before-blocks": "error",
  // Tenary
  "no-unneeded-ternary": "error",
  "no-nested-ternary": "error",
  // Assign
  "no-func-assign": "error",
  "no-class-assign": "error",
  // TypeScript
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: false,
      varsIgnorePattern: "_",
      argsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/adjacent-overload-signatures": "error",
  "@typescript-eslint/no-inferrable-types": "error",
  "@typescript-eslint/method-signature-style": "error",
  "@typescript-eslint/naming-convention": [
    "error",
    {
      selector: "variable",
      format: ["camelCase", "UPPER_CASE"],
    },
  ],

  // Import
  "import/order": [
    "error",
    {
      "newlines-between": "always",
      pathGroups: [
        {
          pattern: "@/**",
          group: "internal",
        },
      ],
      groups: [
        "builtin",
        "external",
        "type",
        "internal",
        ["parent", "sibling", "index"],
        "object",
      ],
    },
  ],
  "import/no-dynamic-require": "error",
  "import/no-cycle": "error",
  "import/no-useless-path-segments": "error",
  "import/export": "error",
  "import/no-mutable-exports": "error",
  "no-restricted-imports": ["error", { paths: ["console"] }],
  // do not use global vars (such as 'status')
  "no-restricted-globals": [
    "error",
    {
      name: "status",
      message: "Do not use global variable [status]. Use local variable instead.",
    },
    {
      name: "name",
      message: "Do not use global variable [name]. Use local variable instead.",
    },
    {
      name: "open",
      message: "Do not use global variable [open]. Use local variable instead.",
    },
  ],
};

const typedRules = {
  "no-throw-literal": "off",
  "@typescript-eslint/no-for-in-array": "error",
  "@typescript-eslint/no-unnecessary-condition": "error",
  "@typescript-eslint/no-unnecessary-type-assertion": "error",
  "@typescript-eslint/only-throw-error": "error",
  "@typescript-eslint/switch-exhaustiveness-check": "error",
};

const reactRules = {
  // base
  "max-lines": ["error", { max: 490, skipComments: true }],
  "space-before-function-paren": "off",
  "arrow-parens": ["error", "always"],
  "import/order": [
    "error",
    {
      "newlines-between": "always",
      pathGroups: [
        {
          pattern: "*.{less,css,scss}",
          patternOptions: { matchBase: true },
          group: "sibling",
          position: "after",
        },
        {
          pattern: "@/**",
          group: "internal",
        },
      ],
      groups: [
        "builtin",
        "external",
        "type",
        "internal",
        ["parent", "sibling", "index"],
        "object",
      ],
    },
  ],
  "import/no-duplicates": "error",

  // React
  "react/jsx-closing-bracket-location": ["error", "line-aligned"],
  "react/self-closing-comp": "error",
  "react/jsx-wrap-multilines": "error",
  "react/jsx-pascal-case": "error",
  "react/jsx-tag-spacing": "error",
  "react/prop-types": "off",
  "react/jsx-sort-props": "error",
  "react/jsx-boolean-value": "error",
  "react/no-array-index-key": "error",
  "react/jsx-no-bind": ["error", { allowArrowFunctions: true }],
  "react/jsx-curly-brace-presence": "error",
  "react/destructuring-assignment": "error",
  "react/no-deprecated": "error",
  "no-restricted-syntax": [
    "error",
    ...baseRules["no-restricted-syntax"].slice(1),
    {
      selector:
        "JSXOpeningElement[name.name='img'] JSXAttribute[name.name='src'][value.expression.type!=/^(Identifier|CallExpression)$/]",
      message: "Import the source file first.",
    },
  ],
  "react/jsx-uses-react": "off",
  "react/react-in-jsx-scope": "off",
  "react/display-name": "off",
};

/** @type {import('eslint').Linter.Config[]} */
const baseConfig = [
  js.configs.recommended,
  ...tsEslint.configs["flat/recommended"],
  importPlugin.flatConfigs.recommended,
  prettierConfig,
  {
    name: "@liangqingda/eslint-config/base",
    plugins: {
      "no-secrets": noSecretsPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
    },
    settings: baseSettings,
    rules: baseRules,
  },
];

/** @type {import('eslint').Linter.Config[]} */
const typedConfig = [
  ...baseConfig,
  {
    name: "@liangqingda/eslint-config/typed",
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: typedRules,
  },
];

/** @type {import('eslint').Linter.Config[]} */
const reactConfig = [
  ...baseConfig,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactHooksPlugin.configs.flat.recommended,
  {
    name: "@liangqingda/eslint-config/react",
    settings: {
      ...baseSettings,
      react: {
        version: "detect",
      },
    },
    rules: reactRules,
  },
];

/** @type {import('eslint').Linter.Config[]} */
const reactTypedConfig = [
  ...reactConfig,
  {
    name: "@liangqingda/eslint-config/react-typed",
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: typedRules,
  },
];

module.exports = {
  baseConfig,
  typedConfig,
  reactConfig,
  reactTypedConfig,
};
