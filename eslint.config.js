import globals from "globals";
import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser, // Add browser-specific globals
    },
    plugins: {
      prettier: prettierPlugin, // Register Prettier as a plugin
    },
    rules: {
      ...prettierConfig.rules, // Apply Prettier recommended rules
      "prettier/prettier": "error", // Treat Prettier formatting issues as ESLint errors
    },
  },
  js.configs.recommended, // ESLint recommended JavaScript rules
];
