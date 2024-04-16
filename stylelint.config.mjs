export default {
  extends: [`stylelint-config-recommended`],
  ignoreDisables: true,
  ignoreFiles: [`.nuxt/**/*.css`, `.output/**/*.css`, `.storybook/**/*.css`, `coverage/**/*.css`],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [`extends`, `tailwind`],
      },
    ],
  },
};
