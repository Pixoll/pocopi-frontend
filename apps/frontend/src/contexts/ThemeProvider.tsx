import { ReactNode, useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const IS_DARK_MODE_KEY = "isDarkMode";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const getInitialMode = (): boolean => {
    if (typeof window === "undefined") return false; // SSR safety

    const savedTheme = localStorage.getItem(IS_DARK_MODE_KEY);

    if (savedTheme === "true" || savedTheme === "false") {
      return savedTheme === "true";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialMode);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    // Apply theme using Bootstrap's data-bs-theme attribute
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem(IS_DARK_MODE_KEY, `${isDarkMode}`);

    // Add some basic body classes for consistency
    if (isDarkMode) {
      document.body.classList.add("bg-dark");
      document.body.classList.add("text-light");
      document.body.classList.remove("bg-light");
      document.body.classList.remove("text-dark");
    } else {
      document.body.classList.add("bg-light");
      document.body.classList.add("text-dark");
      document.body.classList.remove("bg-dark");
      document.body.classList.remove("text-light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevTheme) => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode: isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
