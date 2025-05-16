// Hook personalizado para manejar la instancia y ciclo de vida de RavenAnalytics
// Permite usar la analítica del test de forma reactiva y desacoplada de la UI

import { useRef } from "react";
import { RavenAnalytics, TestResults } from "@/utils/RavenAnalytics";
import { ravenAnalyticsService } from "@/services/ravenAnalyticsService";

/**
 * Hook para inicializar y usar RavenAnalytics en un componente React.
 * @param groupName Nombre del grupo experimental
 * @param protocolName Nombre del protocolo
 */
export function useRavenAnalytics(groupName: string, protocolName: string) {
  // Usamos useRef para mantener la instancia entre renders
  const analyticsRef = useRef<RavenAnalytics | null>(null);

  // Inicializa la instancia solo una vez
  if (!analyticsRef.current) {
    analyticsRef.current = new RavenAnalytics(groupName, protocolName);
  }

  // Métodos expuestos del hook
  return {
    analytics: analyticsRef.current,
    // Guarda los resultados usando el service
    saveResults: (results: TestResults) =>
      ravenAnalyticsService.saveResults(results),
    // Recupera resultados guardados
    getResults: (participantId: string) =>
      ravenAnalyticsService.getResults(participantId),
  };
}
