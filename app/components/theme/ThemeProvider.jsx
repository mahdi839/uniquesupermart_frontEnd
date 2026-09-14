"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  applyThemeToDocument,
  DEFAULT_PRIMARY_COLOR,
  normalizeHex,
} from "@/lib/theme";

const ThemeContext = createContext({
  primaryColor: DEFAULT_PRIMARY_COLOR,
  setPrimaryColor: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [primaryColor, setPrimaryColorState] = useState(DEFAULT_PRIMARY_COLOR);

  const setPrimaryColor = useCallback((color) => {
    const next = applyThemeToDocument(color);
    setPrimaryColorState(next);
    return next;
  }, []);

  useEffect(() => {
    let stored = DEFAULT_PRIMARY_COLOR;
    try {
      stored = localStorage.getItem("site-primary-color") || DEFAULT_PRIMARY_COLOR;
    } catch {
      stored = DEFAULT_PRIMARY_COLOR;
    }

    const initial = applyThemeToDocument(stored);
    setPrimaryColorState(initial);

    const loadSavedColor = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/site-settings`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const json = await response.json();
        const saved = json?.data?.primary_color;
        if (saved) {
          const next = applyThemeToDocument(saved);
          setPrimaryColorState(next);
        }
      } catch {
        // Keep the local fallback if the API is unavailable.
      }
    };

    loadSavedColor();
  }, []);

  const value = useMemo(
    () => ({
      primaryColor: normalizeHex(primaryColor),
      setPrimaryColor,
    }),
    [primaryColor, setPrimaryColor]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
