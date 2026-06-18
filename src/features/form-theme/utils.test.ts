import { describe, it, expect } from "vitest";
import {
  DEFAULT_THEME,
  EMOJI_OPTIONS,
  FONT_OPTIONS,
  PATTERN_OPTIONS,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
  applyThemeToCssVars,
  clearThemeCssVars,
  fontFamilyClass,
  getDefaultTheme,
  isValidHexColor,
  mergeTheme,
  normalizeHexColor,
  patternToClass,
  radiusToClass,
  spacingClass,
} from "./utils";

describe("getDefaultTheme", () => {
  it("returns a fresh copy of the default theme", () => {
    const a = getDefaultTheme();
    const b = getDefaultTheme();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });

  it("matches DEFAULT_THEME shape", () => {
    expect(getDefaultTheme()).toEqual(DEFAULT_THEME);
  });
});

describe("isValidHexColor", () => {
  it("accepts 6-digit hex with hash", () => {
    expect(isValidHexColor("#3b82f6")).toBe(true);
    expect(isValidHexColor("#FFFFFF")).toBe(true);
    expect(isValidHexColor("#000000")).toBe(true);
  });

  it("accepts 3-digit hex with hash", () => {
    expect(isValidHexColor("#fff")).toBe(true);
    expect(isValidHexColor("#000")).toBe(true);
  });

  it("rejects invalid values", () => {
    expect(isValidHexColor("3b82f6")).toBe(false);
    expect(isValidHexColor("#ggg")).toBe(false);
    expect(isValidHexColor("#1234")).toBe(false);
    expect(isValidHexColor("")).toBe(false);
    expect(isValidHexColor("rgb(0,0,0)")).toBe(false);
  });
});

describe("normalizeHexColor", () => {
  it("expands 3-digit hex to 6-digit", () => {
    expect(normalizeHexColor("#f00")).toBe("#ff0000");
    expect(normalizeHexColor("#abc")).toBe("#aabbcc");
  });

  it("lowercases 6-digit hex", () => {
    expect(normalizeHexColor("#AABBCC")).toBe("#aabbcc");
  });

  it("returns default primary color for invalid input", () => {
    expect(normalizeHexColor("not-a-color")).toBe(DEFAULT_THEME.primaryColor);
    expect(normalizeHexColor("")).toBe(DEFAULT_THEME.primaryColor);
  });
});

describe("mergeTheme", () => {
  it("merges partial override on top of base", () => {
    const merged = mergeTheme(DEFAULT_THEME, {
      primaryColor: "#ff0000",
      emoji: "🔥",
    });
    expect(merged.primaryColor).toBe("#ff0000");
    expect(merged.emoji).toBe("🔥");
    expect(merged.backgroundColor).toBe(DEFAULT_THEME.backgroundColor);
  });

  it("does not mutate the base theme", () => {
    const base = { ...DEFAULT_THEME };
    mergeTheme(base, { primaryColor: "#000000" });
    expect(base.primaryColor).toBe(DEFAULT_THEME.primaryColor);
  });
});

describe("radiusToClass", () => {
  it("maps every radius to a Tailwind class", () => {
    for (const option of RADIUS_OPTIONS) {
      expect(radiusToClass(option.value)).toMatch(/^rounded-/);
    }
  });
});

describe("fontFamilyClass", () => {
  it("maps every font to a Tailwind class", () => {
    for (const option of FONT_OPTIONS) {
      expect(fontFamilyClass(option.value)).toMatch(/^font-/);
    }
  });
});

describe("spacingClass", () => {
  it("maps every spacing to a Tailwind space-y class", () => {
    for (const option of SPACING_OPTIONS) {
      expect(spacingClass(option.value)).toMatch(/^space-y-/);
    }
  });
});

describe("patternToClass", () => {
  it("returns empty string for 'none'", () => {
    expect(patternToClass("none")).toBe("");
  });

  it("returns form-pattern class for non-none patterns", () => {
    for (const option of PATTERN_OPTIONS) {
      if (option.value === "none") continue;
      expect(patternToClass(option.value)).toMatch(/^form-pattern-/);
    }
  });
});

describe("applyThemeToCssVars and clearThemeCssVars", () => {
  it("applies the three theme CSS variables to a root element", () => {
    const fakeRoot = {
      style: {
        values: new Map<string, string>(),
        setProperty(name: string, value: string) {
          this.values.set(name, value);
        },
        removeProperty(name: string) {
          this.values.delete(name);
        },
      },
    } as unknown as HTMLElement;

    const theme = {
      ...DEFAULT_THEME,
      primaryColor: "#ff0000",
      backgroundColor: "#00ff00",
      textColor: "#0000ff",
    };

    applyThemeToCssVars(theme, fakeRoot);

    const root = fakeRoot.style as unknown as {
      values: Map<string, string>;
    };
    expect(root.values.get("--form-primary")).toBe("#ff0000");
    expect(root.values.get("--form-bg")).toBe("#00ff00");
    expect(root.values.get("--form-text")).toBe("#0000ff");

    clearThemeCssVars(fakeRoot);
    expect(root.values.has("--form-primary")).toBe(false);
    expect(root.values.has("--form-bg")).toBe(false);
    expect(root.values.has("--form-text")).toBe(false);
  });
});

describe("option arrays", () => {
  it("RADIUS_OPTIONS covers all radius values", () => {
    expect(RADIUS_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["full", "lg", "md", "none", "sm", "xl"].sort()
    );
  });

  it("FONT_OPTIONS covers all font values", () => {
    expect(FONT_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["mono", "sans", "serif"].sort()
    );
  });

  it("SPACING_OPTIONS covers all spacing values", () => {
    expect(SPACING_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["compact", "normal", "relaxed"].sort()
    );
  });

  it("PATTERN_OPTIONS covers all pattern values", () => {
    expect(PATTERN_OPTIONS.map((o) => o.value).sort()).toEqual(
      ["dots", "grid", "none", "waves"].sort()
    );
  });

  it("EMOJI_OPTIONS has at least 8 options and only non-empty strings", () => {
    expect(EMOJI_OPTIONS.length).toBeGreaterThanOrEqual(8);
    for (const emoji of EMOJI_OPTIONS) {
      expect(typeof emoji).toBe("string");
      expect(emoji.length).toBeGreaterThan(0);
    }
  });
});
