import globals from "globals";
import eslintJs from "@eslint/js";
import eslintTs from "typescript-eslint";
import eslintVue from "eslint-plugin-vue";
import eslintPrettier from "eslint-config-prettier";
import nuxt from "./src/utils/type/nuxt.js";
import tailwind from "eslint-plugin-tailwindcss";

export default eslintTs.config(
  {
    files: [`**/*.{js,jsx,ts,tsx,vue}`],
  },
  {
    ignores: [`.nuxt/`, `.output/`, `.storybook/`, `coverage/`],
  },
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  ...eslintVue.configs[`flat/recommended`],
  ...tailwind.configs["flat/recommended"],
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
      "no-empty-pattern": [`off`],
      "vue/no-mutating-props": [`off`],
      "vue/multi-word-component-names": [`off`],
    },
  },
);
