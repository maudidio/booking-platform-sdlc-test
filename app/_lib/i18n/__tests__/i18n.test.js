import test from "node:test";
import assert from "node:assert";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  isSupportedLocale,
} from "../config.js";
import en from "../dictionaries/en.js";
import it from "../dictionaries/it.js";

// Create dictionaries object for tests (mirrors dictionaries/index.js export)
const dictionaries = { en, it };

// Define resolveLocale locally to avoid importing next/headers in test environment
// This is a pure function that replicates the behavior defined in index.js
function resolveLocale(value) {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

// ============================================================================
// AC-1: Valid locale resolution, dictionary parity, and configuration
// ============================================================================

test("AC-1: isSupportedLocale('en') returns true", () => {
  assert.strictEqual(isSupportedLocale("en"), true);
});

test("AC-1: isSupportedLocale('it') returns true", () => {
  assert.strictEqual(isSupportedLocale("it"), true);
});

test("AC-1: resolveLocale('it')==='it'", () => {
  assert.strictEqual(resolveLocale("it"), "it");
});

test("AC-1: resolveLocale('en')==='en'", () => {
  assert.strictEqual(resolveLocale("en"), "en");
});

test("AC-1: resolveLocale with valid locale 'it' returns 'it'", () => {
  assert.strictEqual(resolveLocale("it"), "it");
});

test("AC-1: resolveLocale with valid locale 'en' returns 'en'", () => {
  assert.strictEqual(resolveLocale("en"), "en");
});

test("AC-1: dictionaries.it.navbar.rooms equals 'Camere'", () => {
  assert.strictEqual(dictionaries.it.navbar.rooms, "Camere");
});

test("AC-1: dictionaries.en.navbar.rooms equals 'Rooms'", () => {
  assert.strictEqual(dictionaries.en.navbar.rooms, "Rooms");
});

test("AC-1: dictionaries.it.navbar.contact equals 'Contattaci'", () => {
  assert.strictEqual(dictionaries.it.navbar.contact, "Contattaci");
});

test("AC-1: dictionaries.en.navbar.contact equals 'Contact Us'", () => {
  assert.strictEqual(dictionaries.en.navbar.contact, "Contact Us");
});

test("AC-1: dictionaries.en.navbar.guestArea equals 'Guest Area'", () => {
  assert.strictEqual(dictionaries.en.navbar.guestArea, "Guest Area");
});

test("AC-1: dictionaries.it.navbar.guestArea equals 'Area ospiti'", () => {
  assert.strictEqual(dictionaries.it.navbar.guestArea, "Area ospiti");
});

test("AC-1: dictionaries.it.navbar.home equals 'Home'", () => {
  // Home is not translated
  assert.strictEqual(dictionaries.it.navbar.home, "Home");
});

test("AC-1: Default locale is English", () => {
  assert.strictEqual(DEFAULT_LOCALE, "en");
});

test("AC-1: Supported locales include both en and it", () => {
  assert.deepStrictEqual(SUPPORTED_LOCALES, ["en", "it"]);
});

test("AC-1: Locale labels are defined for all locales", () => {
  assert.strictEqual(LOCALE_LABELS.en, "English");
  assert.strictEqual(LOCALE_LABELS.it, "Italiano");
});

test("AC-1: Cookie name is 'lang'", () => {
  assert.strictEqual(LOCALE_COOKIE, "lang");
});

test("AC-1: Footer dictionaries are defined", () => {
  assert.ok(dictionaries.en.footer);
  assert.ok(dictionaries.it.footer);
  assert.strictEqual(dictionaries.it.footer.contactUs, "Contattaci");
  assert.strictEqual(dictionaries.en.footer.contactUs, "Contact Us");
});

test("AC-1: Account dictionaries are defined", () => {
  assert.ok(dictionaries.en.account);
  assert.ok(dictionaries.it.account);
  assert.strictEqual(dictionaries.it.account.signOut, "Esci");
  assert.strictEqual(dictionaries.en.account.signOut, "Sign out");
});

// ============================================================================
// AC-1: Default language behavior - resolveLocale fallback to English
// ============================================================================

test("AC-1: Default language behavior - resolveLocale without valid locale returns 'en'", () => {
  // This tests the behavior: no cookie or invalid cookie -> English
  assert.strictEqual(resolveLocale(null), "en");
  assert.strictEqual(resolveLocale(undefined), "en");
  assert.strictEqual(resolveLocale(""), "en");
  assert.strictEqual(resolveLocale("fr"), "en");
});

// ============================================================================
// Dictionary parity: en and it must have identical key structures
// ============================================================================

function collectKeys(obj, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      keys.push(...collectKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

test("AC-1: Dictionary parity - en and it have identical key structures", () => {
  const enKeys = collectKeys(en);
  const itKeys = collectKeys(it);
  assert.deepStrictEqual(itKeys, enKeys);
});

test("AC-1: All dictionary values are non-empty strings", () => {
  function checkAllStrings(obj, path = "") {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        checkAllStrings(value, currentPath);
      } else {
        assert.strictEqual(
          typeof value,
          "string",
          `${currentPath} should be a string but is ${typeof value}`
        );
        assert.ok(
          value.length > 0,
          `${currentPath} should be non-empty string but got: \"${value}\"`
        );
      }
    }
  }

  checkAllStrings(en);
  checkAllStrings(it);
});

// ============================================================================
// AC-2: Invalid input handling - error cases for locale validation
// ============================================================================

test("AC-2: isSupportedLocale('fr') returns false", () => {
  assert.strictEqual(isSupportedLocale("fr"), false);
});

test("AC-2: isSupportedLocale(undefined) returns false", () => {
  assert.strictEqual(isSupportedLocale(undefined), false);
});

test("AC-2: isSupportedLocale(null) returns false", () => {
  assert.strictEqual(isSupportedLocale(null), false);
});

test("AC-2: isSupportedLocale(123) returns false", () => {
  assert.strictEqual(isSupportedLocale(123), false);
});

test("AC-2: isSupportedLocale('') returns false", () => {
  assert.strictEqual(isSupportedLocale(""), false);
});

test("AC-2: isSupportedLocale('EN') returns false (case-sensitive)", () => {
  assert.strictEqual(isSupportedLocale("EN"), false);
});

test("AC-2: isSupportedLocale('IT') returns false (case-sensitive)", () => {
  assert.strictEqual(isSupportedLocale("IT"), false);
});

test('AC-2: isSupportedLocale(\"it; Path=/\") returns false', () => {
  assert.strictEqual(isSupportedLocale("it; Path=/"), false);
});

test("AC-2: resolveLocale('fr') returns 'en' (fallback to default)", () => {
  assert.strictEqual(resolveLocale("fr"), "en");
});

test("AC-2: resolveLocale(undefined) returns 'en' (fallback to default)", () => {
  assert.strictEqual(resolveLocale(undefined), "en");
});

test("AC-2: resolveLocale(null) returns 'en' (fallback to default)", () => {
  assert.strictEqual(resolveLocale(null), "en");
});

test("AC-2: resolveLocale('EN') returns 'en' (case-sensitive rejection, fallback)", () => {
  assert.strictEqual(resolveLocale("EN"), "en");
});

test("AC-2: Error message exists for invalid language", () => {
  const errorMsg = dictionaries.en.errors.invalidLanguage;
  assert.ok(errorMsg.includes("Unsupported language"));
  assert.ok(errorMsg.includes("en, it"));
});

test("AC-2: Error message in Italian for invalid language", () => {
  const errorMsg = dictionaries.it.errors.invalidLanguage;
  assert.ok(errorMsg.includes("Lingua non supportata"));
});

test("AC-2: Error message exists for language change failure", () => {
  const errorMsg = dictionaries.en.errors.languageChangeFailed;
  assert.ok(errorMsg);
});

test("AC-2: Error messages differ between languages", () => {
  const enError = dictionaries.en.errors.invalidLanguage;
  const itError = dictionaries.it.errors.invalidLanguage;
  assert.notStrictEqual(enError, itError);
});

test("AC-2: Error messages are non-empty strings", () => {
  assert.strictEqual(
    typeof dictionaries.en.errors.invalidLanguage,
    "string"
  );
  assert.ok(dictionaries.en.errors.invalidLanguage.length > 0);
  assert.strictEqual(
    typeof dictionaries.it.errors.invalidLanguage,
    "string"
  );
  assert.ok(dictionaries.it.errors.invalidLanguage.length > 0);
});

// ============================================================================
// Server-side function behavior tests (validation logic)
// ============================================================================

// Test behavior of setLanguageAction validation logic
// Since next/headers cannot be imported in pure Node.js test environment,
// we test the validation logic indirectly through isSupportedLocale
test("AC-2: Validation logic prevents unsupported locales", () => {
  // This mirrors what setLanguageAction does: check if locale is supported
  const testCases = [
    { locale: "fr", supported: false },
    { locale: "", supported: false },
    { locale: null, supported: false },
    { locale: undefined, supported: false },
    { locale: 123, supported: false },
    { locale: "IT", supported: false },
    { locale: "en", supported: true },
    { locale: "it", supported: true },
  ];

  for (const testCase of testCases) {
    const result = isSupportedLocale(testCase.locale);
    assert.strictEqual(
      result,
      testCase.supported,
      `isSupportedLocale(${JSON.stringify(testCase.locale)}) should be ${testCase.supported} but got ${result}`
    );
  }
});

test("AC-2: setLanguageAction validation - rejects unsupported locales", () => {
  // Test that invalid locales that would be passed to setLanguageAction
  // are properly rejected by the validation function
  const invalidLocales = ["fr", "", null, undefined, 123, "IT", "it; Path=/"];
  for (const locale of invalidLocales) {
    const isSupported = isSupportedLocale(locale);
    assert.strictEqual(isSupported, false, `${locale} should be rejected`);
  }
});

test("AC-2: setLanguageAction validation - accepts supported locales", () => {
  // Test that valid locales that would be passed to setLanguageAction
  // are properly accepted by the validation function
  const validLocales = ["en", "it"];
  for (const locale of validLocales) {
    const isSupported = isSupportedLocale(locale);
    assert.strictEqual(isSupported, true, `${locale} should be accepted`);
  }
});

// ============================================================================
// AC-1: Configuration and default locale tests
// ============================================================================

test("AC-1: Default locale is used for fallback", () => {
  // Verify that DEFAULT_LOCALE is 'en' and resolveLocale uses it
  assert.strictEqual(DEFAULT_LOCALE, "en");
  assert.strictEqual(resolveLocale("invalid"), DEFAULT_LOCALE);
});

test("AC-1: Valid locales resolve to themselves", () => {
  // Test that valid locales are returned unchanged
  SUPPORTED_LOCALES.forEach((locale) => {
    assert.strictEqual(resolveLocale(locale), locale);
  });
});

test("AC-1: Invalid locales fallback to default", () => {
  // Test various invalid inputs fallback to default
  const invalidInputs = [null, undefined, "", "fr", "de", "es"];
  invalidInputs.forEach((input) => {
    assert.strictEqual(
      resolveLocale(input),
      DEFAULT_LOCALE,
      `resolveLocale(${JSON.stringify(input)}) should return DEFAULT_LOCALE`
    );
  });
});

// ============================================================================
// AC-1: New namespaces moved from hard-coded page text (home, contact, auth,
// rooms, checkout, history, profile, payment)
// ============================================================================

const NEW_NAMESPACES = [
  "home",
  "contact",
  "auth",
  "rooms",
  "checkout",
  "history",
  "profile",
  "payment",
];

test("AC-1: Every new namespace exists as an object in en and it", () => {
  for (const ns of NEW_NAMESPACES) {
    assert.ok(en[ns] && typeof en[ns] === "object", `en.${ns} must exist`);
    assert.ok(it[ns] && typeof it[ns] === "object", `it.${ns} must exist`);
  }
});

test("AC-1: Italian rooms.search differs from English", () => {
  assert.notStrictEqual(it.rooms.search, en.rooms.search);
});

test("AC-1: Italian auth.signIn differs from English", () => {
  assert.notStrictEqual(it.auth.signIn, en.auth.signIn);
});

test("AC-1: Italian payment.forbidden differs from English", () => {
  assert.notStrictEqual(it.payment.forbidden, en.payment.forbidden);
});

test("AC-1: Italian home.cancel differs from English", () => {
  assert.notStrictEqual(it.home.cancel, en.home.cancel);
});

test("AC-1: Italian history.viewRooms differs from English", () => {
  assert.notStrictEqual(it.history.viewRooms, en.history.viewRooms);
});

test("AC-1: en.rooms.banner equals the original literal 'Accomodation Options'", () => {
  assert.strictEqual(en.rooms.banner, "Accomodation Options");
});

test("AC-1: en.auth.signIn equals the original literal 'Sign In'", () => {
  assert.strictEqual(en.auth.signIn, "Sign In");
});

test("AC-1: en.auth.signUp equals the original literal 'Sign Up'", () => {
  assert.strictEqual(en.auth.signUp, "Sign Up");
});

test("AC-1: en.auth.checking equals the original literal 'Checking...'", () => {
  assert.strictEqual(en.auth.checking, "Checking...");
});

test("AC-1: en.payment.forbidden equals the original literal 'Forbidden'", () => {
  assert.strictEqual(en.payment.forbidden, "Forbidden");
});

test("AC-1: en.home.heroLine1 keeps the original typo 'Foriegn'", () => {
  assert.strictEqual(en.home.heroLine1, "Find Comfort In a Foriegn Land With Us");
});

test("AC-1: en.contact.bannerTitle equals the original literal 'REACHING OUT'", () => {
  assert.strictEqual(en.contact.bannerTitle, "REACHING OUT");
});

test("AC-1: en.checkout.banner equals the original literal 'BOOKING CONFIRMATION'", () => {
  assert.strictEqual(en.checkout.banner, "BOOKING CONFIRMATION");
});

test("AC-1: en.rooms.from and en.rooms.perNight are non-empty strings", () => {
  assert.strictEqual(typeof en.rooms.from, "string");
  assert.ok(en.rooms.from.length > 0);
  assert.strictEqual(typeof en.rooms.perNight, "string");
  assert.ok(en.rooms.perNight.length > 0);
});

test("AC-1: it.rooms.from and it.rooms.perNight are non-empty strings", () => {
  assert.strictEqual(typeof it.rooms.from, "string");
  assert.ok(it.rooms.from.length > 0);
  assert.strictEqual(typeof it.rooms.perNight, "string");
  assert.ok(it.rooms.perNight.length > 0);
});
