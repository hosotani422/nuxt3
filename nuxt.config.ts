import path from "path";
import postcss from "./postcss.config.js";

export default defineNuxtConfig({
  ssr: true,
  rootDir: `src`,
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
  modules: [`@pinia/nuxt`],
  imports: {
    presets: [
      {
        from: `pinia`,
        imports: [`createPinia`],
      },
    ],
  },
  postcss,
});
