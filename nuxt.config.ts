import * as path from "path";

export default defineNuxtConfig({
  ssr: true,
  // 通常時は`src`、storybook起動時は``を指定（storybookを起動するのに必要）
  rootDir: process.env.npm_lifecycle_script?.includes(`nuxt`) ? `src` : ``,
  buildDir: `../.nuxt`,
  css: [`@/assets/style/tailwind.css`],
  components: {
    global: true,
    dirs: [`@/components`],
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, `src`),
      },
    },
  },
  typescript: {
    shim: false,
  },
  modules: [`@pinia/nuxt`, `@nuxtjs/i18n`],
  i18n: { vueI18n: `@/locales/i18n.config.ts` },
  imports: {
    presets: [
      {
        from: `pinia`,
        imports: [`createPinia`],
      },
    ],
  },
  postcss: require(`./postcss.config.js`),
});
