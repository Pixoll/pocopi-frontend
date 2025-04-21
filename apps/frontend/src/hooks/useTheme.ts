import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "@/contexts/ThemeContext";

/**
 * Hook personalizado para acceder al contexto del tema
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe utilizarse dentro de un ThemeProvider");
  }

  return context;
};
