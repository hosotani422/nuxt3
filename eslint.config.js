import path from "path";
import { fileURLToPath } from "url";
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";
import eslintJs from "@eslint/js";
import eslintTs from "typescript-eslint";
import eslintVue from "eslint-plugin-vue";
import eslintPrettier from "eslint-config-prettier";
import nuxt from "./src/utils/type/nuxt.js";
// import tailwindcss from "eslint-plugin-tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });
// const compat = new FlatCompat();

export default eslintTs.config(
  {
    files: [`**/*.{js,jsx,ts,tsx,vue}`],
  },
  {
    ignores: [`src/utils/cordova/`, `.nuxt/`, `.output/`, `.storybook/`, `coverage/`],
  },
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  ...eslintVue.configs[`flat/recommended`],
  ...compat.config({
    // root: true,
    // env: {
    //   browser: true,
    //   es2024: true,
    // },
    // parser: `vue-eslint-parser`,
    // parserOptions: {
    //   parser: `@typescript-eslint/parser`,
    //   ecmaVersion: `latest`,
    //   sourceType: `module`,
    // },
    // plugins: [`@typescript-eslint`, `vue`, `tailwindcss`],
    plugins: [`tailwindcss`],
    extends: [`plugin:tailwindcss/recommended`],
    // rules: {
    //   "tailwindcss/classnames-order": `error`,
    //   "tailwindcss/enforces-negative-arbitrary-values": "error",
    //   "tailwindcss/enforces-shorthand": "error",
    //   "tailwindcss/migration-from-tailwind-2": "error",
    //   "tailwindcss/no-arbitrary-value": "error",
    //   "tailwindcss/no-custom-classname": "error",
    //   "tailwindcss/no-contradicting-classname": "error",
    //   "tailwindcss/no-unnecessary-arbitrary-value": "error",
    // },
    // noInlineConfig: true,
  }),
  // ...compat.extends(`plugin:tailwindcss/recommended`),
  eslintPrettier,
  {
    name: `custom/recommended`,
    languageOptions: {
      ecmaVersion: `latest`,
      sourceType: `module`,
      parserOptions: {
        parser: eslintTs.parser,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...nuxt.globals,
      },
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: `error`,
    },
    rules: {
      "no-console": [`error`],
      "vue/no-console": `error`,
      "vue/no-mutating-props": [`off`],
      "no-empty-pattern": [`off`],
      "vue/multi-word-component-names": [`off`],
      "tailwindcss/classnames-order": `error`,
      "tailwindcss/enforces-negative-arbitrary-values": "error",
      "tailwindcss/enforces-shorthand": "error",
      "tailwindcss/migration-from-tailwind-2": "error",
      "tailwindcss/no-arbitrary-value": "error",
      "tailwindcss/no-custom-classname": "error",
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/no-unnecessary-arbitrary-value": "error",
    },
  },
);
