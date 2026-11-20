export const SUPPORTED_LOCALES = ["en", "it"];
export const DEFAULT_LOCALE = "en";
export const LOCALE_COOKIE = "lang";
export const LOCALE_LABELS = { en: "English", it: "Italiano" };

export function isSupportedLocale(value) {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value);
}
