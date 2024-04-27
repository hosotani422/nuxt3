import { StorybookConfig } from "@storybook/vue3-vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { mergeConfig } from "vite";
import path from "path";

const config: StorybookConfig = {
  stories: [`./stories/**/*.stories.ts`],
  framework: `@storybook/vue3-vite`,
  addons: [`@storybook/addon-essentials`],
  viteFinal: (config) => ({
    ...mergeConfig(config, {
      plugins: [
        vue(),
        AutoImport({
          imports: [`vue`, `pinia`, `vue-router`],
          dts: false,
        }),
        Components({
          dirs: [`../src/components`],
          directoryAsNamespace: true,
          dts: false,
        }),
      ],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, `../../src`),
          "~": path.resolve(__dirname, `../../src`),
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
