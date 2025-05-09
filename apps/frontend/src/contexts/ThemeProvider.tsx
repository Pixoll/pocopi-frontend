import { ReactNode, useState, useEffect } from "react";
import { ThemeContext, Theme } from "./ThemeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "light"; // SSR safety

    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Apply theme using Bootstrap's data-bs-theme attribute
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);

    // Add some basic body classes for consistency
    if (theme === "dark") {
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
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
