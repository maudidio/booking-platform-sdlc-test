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

// ============================================================================
// AC-1: Valid locale resolution, dictionary parity, and configuration
// ============================================================================

test("AC-1: isSupportedLocale('en') returns true", () => {
  assert.strictEqual(isSupportedLocale("en"), true);
});

test("AC-1: isSupportedLocale('it') returns true", () => {
  assert.strictEqual(isSupportedLocale("it"), true);
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

// ============================================================================
// Locale label validation
// ============================================================================

test("AC-1: All supported locales have labels", () => {
  for (const locale of SUPPORTED_LOCALES) {
    assert.ok(
      LOCALE_LABELS[locale],
      `Locale ${locale} should have a label but got ${LOCALE_LABELS[locale]}`
    );
    assert.strictEqual(
      typeof LOCALE_LABELS[locale],
      "string",
      `Label for ${locale} should be a string`
    );
    assert.ok(
      LOCALE_LABELS[locale].length > 0,
      `Label for ${locale} should be non-empty`
    );
  }
});

// ============================================================================
// Navbar translations coverage
// ============================================================================

test("AC-1: Navbar translations for all required menu items", () => {
  const requiredNavbarItems = ["home", "rooms", "contact", "guestArea"];
  for (const item of requiredNavbarItems) {
    assert.ok(
      dictionaries.en.navbar[item],
      `English navbar should have ${item}`
    );
    assert.ok(
      dictionaries.it.navbar[item],
      `Italian navbar should have ${item}`
    );
  }
});

test("AC-1: Account sidebar translations", () => {
  const requiredAccountItems = ["history", "profile", "signOut"];
  for (const item of requiredAccountItems) {
    assert.ok(
      dictionaries.en.account[item],
      `English account should have ${item}`
    );
    assert.ok(
      dictionaries.it.account[item],
      `Italian account should have ${item}`
    );
  }
});
