// Punto de entrada principal para la aplicación frontend de la Prueba de Raven.
// Gestiona la navegación global, el theming y el estado de nivel superior.

import { config } from "@pocopi/config";
import { JSX, useState, useEffect } from "react";
import { RavenMatrixPage } from "@/pages/RavenMatrixPage.tsx";
import HomePage from "@/pages/HomePage";
import CompletionModal from "@/components/HomePage/CompletionModal";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";
import "bootstrap/dist/css/bootstrap.min.css";

// Enum para todas las páginas/rutas posibles en la app
// Permite navegación type-safe y fácil extensión
enum Page {
  HOME,
  RAVEN_MATRIX,
  END,
  DASHBOARD,
}

// Interfaz estrictamente tipada para los datos del estudiante
// Usada en toda la app para consistencia y seguridad de tipos
interface StudentData {
  name: string;
  id: string;
  email: string;
  age: string;
}

/**
 * ThemeHandler
 * Establece el tema de Bootstrap (claro/oscuro) en el root del documento según el contexto.
 * Esto asegura un theming consistente en todos los componentes.
 */
const ThemeHandler = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Establece el atributo de tema de Bootstrap para el estilo global
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return <>{children}</>;
};

/**
 * App
 * Componente principal de la aplicación. Gestiona la navegación, el estado global y el theming.
 * Utiliza páginas y componentes modularizados para claridad y mantenibilidad.
 */
export default function App(): JSX.Element {
  // Grupo para la prueba (puede extenderse para A/B testing, etc.)
  const [group] = useState(config.sampleGroup());
  // Página actual (estado de navegación)
  const [page, setPage] = useState<Page>(Page.HOME);
  // Datos del estudiante recogidos del formulario (null si no ha comenzado)
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  /**
   * Handler para iniciar la prueba después de recoger los datos del estudiante.
   * @param data - Objeto StudentData del formulario
   */
  const startTest = (data: StudentData) => {
    setStudentData(data);
    setPage(Page.RAVEN_MATRIX);
  };

  /**
   * Handler para volver a la página de inicio.
   */
  const goToHome = () => {
    setPage(Page.HOME);
  };

  /**
   * Handler para navegar al dashboard de analíticas.
   */
  const goToDashboard = () => {
    setPage(Page.DASHBOARD);
  };

  /**
   * Renderiza la página actual según el estado de navegación.
   * Utiliza componentes modularizados para cada ruta.
   */
  const renderPage = () => {
    switch (page) {
      case Page.HOME:
        // Página de inicio: recoge datos del estudiante y permite acceso al dashboard
        return <HomePage onStartTest={startTest} onDashboard={goToDashboard} />;
      case Page.RAVEN_MATRIX:
        // Página de la prueba Raven: lógica principal y UI de la prueba
        return (
          <RavenMatrixPage
            group={group}
            goToNextPage={() => setPage(Page.END)}
            studentData={studentData}
          />
        );
      case Page.END:
        // Modal de finalización: se muestra tras terminar la prueba
        return (
          <CompletionModal studentData={studentData} onBackToHome={goToHome} />
        );
      case Page.DASHBOARD:
        // Dashboard de analíticas: muestra resultados y analíticas
        return <AnalyticsDashboard onBack={goToHome} />;
      default:
        // Fallback: no renderiza nada (no debería ocurrir)
        return null;
    }
  };

  // Envuelve la app en ThemeProvider y ThemeHandler para theming global
  return (
    <ThemeProvider>
      <ThemeHandler>{renderPage()}</ThemeHandler>
    </ThemeProvider>
  );
}
