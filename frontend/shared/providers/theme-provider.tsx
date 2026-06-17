"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextData {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "bizships-theme";
const ThemeContext = createContext<ThemeContextData>({
  theme: "system",
  setTheme: () => {},
});

const isTheme = (value: string | null): value is Theme => {
  return value === "light" || value === "dark" || value === "system";
};

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: Theme) => {
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.style.colorScheme = resolvedTheme;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    let isActive = true;
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const nextTheme = isTheme(savedTheme) ? savedTheme : "system";

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      setThemeState(nextTheme);
      applyTheme(nextTheme);
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      setThemeState((currentTheme) => {
        if (currentTheme === "system") {
          applyTheme("system");
        }

        return currentTheme;
      });
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, nextTheme);
    setThemeState(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
