"use client";

import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

// Inline in <head> so the theme is set before first paint (no flash).
export const themeInitScript = `!function(){try{var t=localStorage.getItem("${STORAGE_KEY}");("light"===t||"dark"===t)&&document.documentElement.setAttribute("data-theme",t)}catch(e){}}()`;

// The device preference applies until the visitor picks a theme; after that their pick sticks.
function currentTheme(): Theme {
  const chosen = document.documentElement.getAttribute("data-theme");
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function ThemeToggle() {
  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  // Both icons render; CSS shows the one for the theme a click switches to.
  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.toggle}
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
    >
      <span className={styles.toDark}>
        <MoonIcon />
      </span>
      <span className={styles.toLight}>
        <SunIcon />
      </span>
    </button>
  );
}
