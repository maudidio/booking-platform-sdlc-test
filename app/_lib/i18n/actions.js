"use server";

import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isSupportedLocale } from "./config";
import { dictionaries } from "./dictionaries";

export async function setLanguageAction(locale) {
  if (!isSupportedLocale(locale)) {
    return { ok: false, error: dictionaries[DEFAULT_LOCALE].errors.invalidLanguage };
  }

  cookies().set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { ok: true, locale };
}
