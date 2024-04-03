import * as ja from "@/locales/ja.json";
import * as en from "@/locales/en.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: `ja`,
  defaultLocale: `ja`,
  messages: { ja, en },
}));
