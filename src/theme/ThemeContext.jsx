import React, { useEffect, useMemo, useState } from "react";
import ThemeCtx from "./theme.core";
import { bootTheme, getStoredTheme, setStoredTheme } from "./theme.client";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    bootTheme();
  }, []);
  useEffect(() => {
    setStoredTheme(theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeCtx);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
