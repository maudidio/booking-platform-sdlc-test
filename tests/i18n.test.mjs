import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  isSupportedLocale,
} from "../app/_lib/i18n/locales.js";
import { getDictionary } from "../app/_lib/i18n/index.js";
import en from "../app/_lib/i18n/dictionaries/en.js";
import it from "../app/_lib/i18n/dictionaries/it.js";

function collectKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === "object"
      ? collectKeys(value, path)
      : [path];
  });
}

function collectLeaves(obj) {
  return Object.values(obj).flatMap((value) =>
    value !== null && typeof value === "object" ? collectLeaves(value) : [value],
  );
}

describe("locales", () => {
  test("AC-1: SUPPORTED_LOCALES equals en and it", () => {
    assert.deepEqual(SUPPORTED_LOCALES, ["en", "it"]);
  });

  test("AC-1: default locale is en", () => {
    assert.equal(DEFAULT_LOCALE, "en");
  });

  test("AC-1: cookie name is NEXT_LOCALE", () => {
    assert.equal(LOCALE_COOKIE, "NEXT_LOCALE");
  });

  test("AC-1: every supported locale has a non-empty label", () => {
    for (const locale of SUPPORTED_LOCALES) {
      assert.equal(typeof LOCALE_LABELS[locale], "string");
      assert.ok(LOCALE_LABELS[locale].length > 0);
    }
  });

  test("AC-1: isSupportedLocale is true for en and it", () => {
    assert.equal(isSupportedLocale("en"), true);
    assert.equal(isSupportedLocale("it"), true);
  });

  for (const [label, value] of [
    ["fr", "fr"],
    ["empty string", ""],
    ["null", null],
    ["undefined", undefined],
    ["number", 123],
    ["uppercase EN", "EN"],
    ["en;x", "en;x"],
  ]) {
    test(`AC-2: isSupportedLocale is false for ${label}`, () => {
      assert.equal(isSupportedLocale(value), false);
    });
  }
});

describe("dictionaries", () => {
  test("AC-1: en and it have identical recursive key sets", () => {
    assert.deepEqual(collectKeys(en).sort(), collectKeys(it).sort());
  });

  test("AC-1: all dictionary leaves are non-empty strings", () => {
    for (const dict of [en, it]) {
      for (const leaf of collectLeaves(dict)) {
        assert.equal(typeof leaf, "string");
        assert.ok(leaf.trim().length > 0);
      }
    }
  });

  test("AC-1: getDictionary('it').nav.rooms is Camere", () => {
    assert.equal(getDictionary("it").nav.rooms, "Camere");
  });

  test("AC-1: getDictionary('en').nav.rooms is Rooms", () => {
    assert.equal(getDictionary("en").nav.rooms, "Rooms");
  });

  for (const [label, value] of [
    ["fr", "fr"],
    ["empty string", ""],
    ["null", null],
    ["undefined", undefined],
    ["uppercase IT", "IT"],
  ]) {
    test(`AC-2: getDictionary falls back to English for ${label}`, () => {
      assert.equal(getDictionary(value), en);
    });
  }
});
