const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  {
    files: ["**/*.ts"],
    ignores: ["config/**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescript.configs["recommended"].rules,
      ...typescript.configs["recommended-requiring-type-checking"].rules,
      "no-nested-ternary": "off",
      "no-unused-vars": "off",
      "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-meaningless-void-operator": "warn",
      "@typescript-eslint/no-confusing-void-expression": "error",
      "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-restricted-exports": "off",
      eqeqeq: "error",
      "no-unneeded-ternary": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "import/prefer-default-export": "off",
      "arrow-body-style": "off",
    },
  },
  {
    files: ["config/**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      // Add any specific rules for config files here, or leave it empty for minimal linting
    },
  },
];
