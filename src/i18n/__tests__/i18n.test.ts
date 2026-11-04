import { describe, it, expect } from "vitest";
import { getDirection, isLocale, DEFAULT_LOCALE } from "../config";
import { getDictionary } from "../dictionaries";

type Tree = { [key: string]: string | Tree };

const flatten = (obj: Tree, prefix = ""): Record<string, string> =>
  Object.entries(obj).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") acc[path] = value;
    else Object.assign(acc, flatten(value, path));
    return acc;
  }, {});

describe("i18n config", () => {
  it("uses right-to-left only for Arabic", () => {
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
  });

  it("accepts only supported locales and defaults to English", () => {
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(DEFAULT_LOCALE).toBe("en");
  });
});

describe("dictionaries", () => {
  const en = flatten(getDictionary("en") as unknown as Tree);
  const ar = flatten(getDictionary("ar") as unknown as Tree);

  it("Arabic has exactly the same keys as English", () => {
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
  });

  it("has no empty translations", () => {
    for (const [key, value] of Object.entries({ ...en, ...ar })) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("Arabic UI text is actually Arabic (except numbers and the switch-to-English label)", () => {
    const arabicLetters = /[؀-ۿ]/;
    const allowedLatin = new Set(["language.switchTo"]);
    for (const [key, value] of Object.entries(ar)) {
      if (allowedLatin.has(key)) continue;
      expect(arabicLetters.test(value), key).toBe(true);
    }
  });
});
