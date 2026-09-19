export const DEFAULT_PRIMARY_COLOR = "#7d0ba7";
export const THEME_STORAGE_KEY = "site-theme-vars";

export const PRESET_COLORS = [
  { label: "Eyara Purple", value: "#7d0ba7" },
  { label: "Coral Pink", value: "#eb3b5a" },
  { label: "Classic Red", value: "#db3340" },
  { label: "Royal Blue", value: "#1d4ed8" },
  { label: "Emerald", value: "#059669" },
  { label: "Sunset Orange", value: "#ea580c" },
  { label: "Hot Pink", value: "#db2777" },
  { label: "Teal", value: "#0d9488" },
  { label: "Gold", value: "#ca8a04" },
  { label: "Charcoal", value: "#1f2937" },
];

export function normalizeHex(color) {
  if (!color || typeof color !== "string") return DEFAULT_PRIMARY_COLOR;

  let hex = color.trim().toLowerCase();
  if (!hex.startsWith("#")) hex = `#${hex}`;

  if (/^#[0-9a-f]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  return /^#[0-9a-f]{6}$/.test(hex) ? hex : DEFAULT_PRIMARY_COLOR;
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex).slice(1);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function channelLuminance(value) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

export function contrastOnPrimary(hex) {
  return relativeLuminance(hex) > 0.55 ? "#111111" : "#ffffff";
}

export function readableOnLight(hex) {
  const color = normalizeHex(hex);
  return relativeLuminance(color) > 0.45 ? mixHex(color, "#000000", 0.42) : color;
}

function mixHex(hex, targetHex, amount) {
  const from = hexToRgb(hex);
  const to = hexToRgb(targetHex);
  const mix = (start, end) => Math.round(start + (end - start) * amount);

  return `#${[mix(from.r, to.r), mix(from.g, to.g), mix(from.b, to.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function buildThemeCssVars(primary) {
  const color = normalizeHex(primary);
  const rgb = hexToRgb(color);

  const onPrimary = contrastOnPrimary(color);
  const onLight = readableOnLight(color);

  return {
    "--primary-color": color,
    "--primary-hover": mixHex(color, "#000000", 0.16),
    "--primary-dark": mixHex(color, "#000000", 0.3),
    "--primary-light": mixHex(color, "#ffffff", 0.88),
    "--primary-rgb": `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    "--primary-contrast": onPrimary,
    "--primary-on-light": onLight,
    "--primary-gradient-start": mixHex(color, "#ffffff", 0.22),
    "--primary-gradient-mid": color,
    "--primary-gradient-end": mixHex(color, "#000000", 0.22),
    "--hover-color": mixHex(color, "#000000", 0.24),
    "--active-color": mixHex(color, "#000000", 0.36),
    "--bs-primary": color,
    "--bs-primary-rgb": `${rgb.r}, ${rgb.g}, ${rgb.b}`,
  };
}

export function applyThemeToDocument(primary) {
  if (typeof document === "undefined") return normalizeHex(primary);

  const color = normalizeHex(primary);
  const vars = buildThemeCssVars(color);
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(vars));
    localStorage.setItem("site-primary-color", color);
  } catch {
    // Ignore private-mode storage failures.
  }

  return color;
}

export function getPrimaryColor() {
  if (typeof document === "undefined") return DEFAULT_PRIMARY_COLOR;

  const fromCss = document.documentElement.style.getPropertyValue("--primary-color").trim();
  if (fromCss) return normalizeHex(fromCss);

  try {
    const stored = localStorage.getItem("site-primary-color");
    if (stored) return normalizeHex(stored);
  } catch {
    // Ignore storage access errors.
  }

  const computed = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary-color")
    .trim();

  return computed ? normalizeHex(computed) : DEFAULT_PRIMARY_COLOR;
}
