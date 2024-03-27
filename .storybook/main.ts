import { StorybookConfig } from "@storybook-vue/nuxt";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { mergeConfig } from "vite";
import path from "path";

const config: StorybookConfig = {
  stories: [`../test/storybook/stories/**/*.stories.ts`],
  framework: `@storybook-vue/nuxt`,
  addons: [
    `@storybook/addon-essentials`,
    {
      name: `@storybook/addon-postcss`,
      options: {
        postcssLoaderOptions: {
          implementation: import(`postcss`),
        },
      },
    },
  ],
  viteFinal: (config) => ({
    ...mergeConfig(config, {
      plugins: [
        AutoImport({
          imports: [`vue`, `pinia`, `vue-router`],
          dts: false,
        }),
        Components({
          dirs: [`./src/components`],
          directoryAsNamespace: true,
          dts: false,
        }),
      ],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, `../src`),
          "~": path.resolve(__dirname, `../src`),
        },
      },
    }),
    define: {
      ...config.define,
      "process.client": true,
    },
  }),
};

export default config;
