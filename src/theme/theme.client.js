const KEY = "theme.v1";
export function getStoredTheme() {
  try {
    return localStorage.getItem(KEY) || "light";
  } catch {
    return "light";
  }
}
export function setStoredTheme(mode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch (e) {
    // ignore storage errors (e.g., cookies/localStorage disabled), but log for debugging
    console.error("Failed to set theme in localStorage:", e);
  }
}
export function bootTheme() {
  const mode = getStoredTheme();
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
