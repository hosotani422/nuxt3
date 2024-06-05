import type { Config } from "tailwindcss";
import tailwind from "./src/assets/style/tailwind";

export default {
  content: {
    relative: true,
    files: [
      `./src/app.vue`,
      `./src/layouts/**/*.vue`,
      `./src/pages/**/*.vue`,
      `./src/components/**/*.vue`,
      `./src/stores/**/*.ts`,
    ],
  },
  darkMode: `class`,
  presets: [tailwind],
} satisfies Config;
