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
      "no-nested-ternary": "warn",
      "no-unused-vars": "warn",
      "no-plusplus": ["warn", { allowForLoopAfterthoughts: true }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-meaningless-void-operator": "off",
      "@typescript-eslint/no-confusing-void-expression": "warn",
      "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "warn",
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"], // Changed to "interface"
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      eqeqeq: "warn",
      "no-unneeded-ternary": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
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
      // Minimal linting for config files

      const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig");

const app = express();

// Your route handlers here

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Example of a basic route
app.get("/api/hello", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

    },
  },
];
