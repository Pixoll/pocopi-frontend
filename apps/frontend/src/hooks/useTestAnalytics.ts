// Hook personalizado para manejar la instancia y ciclo de vida de TestAnalytics
// Permite usar la analítica del test de forma reactiva y desacoplada de la UI

import { useRef } from "react";
import { TestAnalytics, TestResults } from "@/utils/TestAnalytics.ts";
import { testAnalyticsService } from "@/services/testAnalyticsService.ts";

/**
 * Hook para inicializar y usar TestAnalytics en un componente React.
 * @param groupName Nombre del grupo experimental
 * @param protocolName Nombre del protocolo
 */
export function useTestAnalytics(groupName: string) {
  // Usamos useRef para mantener la instancia entre renders
  const analyticsRef = useRef<TestAnalytics | null>(null);

  // Inicializa la instancia solo una vez
  if (!analyticsRef.current) {
    analyticsRef.current = new TestAnalytics(groupName);
  }

  // Métodos expuestos del hook
  return {
    analytics: analyticsRef.current,
    // Guarda los resultados usando el service
    saveResults: (results: TestResults) =>
      testAnalyticsService.saveResults(results),
    // Recupera resultados guardados
    getResults: (participantId: string) =>
      testAnalyticsService.getResults(participantId),
  };
}
