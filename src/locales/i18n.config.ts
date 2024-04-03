import ja from "@/locales/ja.json";
import en from "@/locales/en.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: `ja`,
  defaultLocale: `ja`,
  messages: { ja, en },
}));
