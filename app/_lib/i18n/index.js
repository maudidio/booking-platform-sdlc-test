import en from "./dictionaries/en.js";
import it from "./dictionaries/it.js";
import { DEFAULT_LOCALE, isSupportedLocale } from "./locales.js";

const dictionaries = { en, it };

export function getDictionary(locale) {
  return dictionaries[isSupportedLocale(locale) ? locale : DEFAULT_LOCALE];
}
