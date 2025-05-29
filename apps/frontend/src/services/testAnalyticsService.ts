// Service para persistir y recuperar resultados de TestAnalytics
// Centraliza la lógica de almacenamiento (localStorage, API, etc.)

import { TestResults } from "@/utils/TestAnalytics.ts";

export const testAnalyticsService = {
  // Guarda los resultados en localStorage
  saveResults: (results: TestResults) => {
    try {
      const key = `test_${results.participantId}`;
      localStorage.setItem(key, JSON.stringify(results));
      // Puedes agregar lógica para enviar a un backend aquí
    } catch (error) {
      console.error("Error saving results to localStorage:", error);
    }
  },
  // Recupera los resultados desde localStorage
  getResults: (participantId: string): TestResults | null => {
    try {
      const key = `test_${participantId}`;
      const data = localStorage.getItem(key);
      return data ? (JSON.parse(data) as TestResults) : null;
    } catch (error) {
      console.error("Error getting results from localStorage:", error);
      return null;
    }
  },
};
