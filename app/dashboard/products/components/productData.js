/**
 * Product JSON has existed in a few shapes over time (arrays, JSON strings,
 * and numerically keyed objects). Keep old records from crashing admin pages.
 */
export function asProductArray(value) {
  let normalized = value;

  for (let attempt = 0; attempt < 2 && typeof normalized === "string"; attempt += 1) {
    try {
      normalized = JSON.parse(normalized);
    } catch {
      return [];
    }
  }

  if (Array.isArray(normalized)) return normalized;
  if (!normalized || typeof normalized !== "object") return [];
  if (Array.isArray(normalized.data)) return normalized.data;

  const keys = Object.keys(normalized);
  if (keys.length > 0 && keys.every((key) => /^\d+$/.test(key))) {
    return Object.values(normalized);
  }

  // Some early color records were saved as one object instead of an array.
  if (["id", "code", "name", "image"].some((key) => key in normalized)) {
    return [normalized];
  }

  return [];
}
