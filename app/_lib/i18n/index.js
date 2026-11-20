import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isSupportedLocale } from "./config";
import { dictionaries } from "./dictionaries";

export function resolveLocale(value) {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getLocale() {
  // Next 14: cookies() is synchronous.
  return resolveLocale(cookies().get(LOCALE_COOKIE)?.value);
}

export async function getDictionary() {
  return dictionaries[await getLocale()];
}
