module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2023: true,
  },
  parser: `vue-eslint-parser`,
  parserOptions: {
    parser: `@typescript-eslint/parser`,
    ecmaVersion: `latest`,
    sourceType: `module`,
  },
  plugins: [`@typescript-eslint`, `vue`, `tailwindcss`],
  extends: [
    `eslint:recommended`,
    `plugin:@typescript-eslint/recommended`,
    `plugin:vue/vue3-recommended`,
    `plugin:tailwindcss/recommended`,
    `prettier`,
  ],
  noInlineConfig: true,
  ignorePatterns: [`src/utils/cordova`, `.nuxt`, `.output`, `storybook-static`],
  rules: {
    "no-console": [`error`],
    "no-undef": [`off`],
    "no-empty-pattern": [`off`],
    "@typescript-eslint/no-non-null-assertion": [`off`],
    "vue/multi-word-component-names": [`off`],
    "vue/no-mutating-props": [`off`],
    "tailwindcss/enforces-shorthand": [`off`],
    "tailwindcss/no-unnecessary-arbitrary-value": [`off`],
  },
};
