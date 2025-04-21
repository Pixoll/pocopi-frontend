import { createContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Valor por defecto para el contexto
const defaultValue: ThemeContextType = {
  theme: "light",
  toggleTheme: () => {}, // Función vacía como placeholder
};

// Creamos el contexto con un valor por defecto
export const ThemeContext = createContext<ThemeContextType>(defaultValue);
