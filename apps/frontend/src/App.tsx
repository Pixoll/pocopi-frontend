// Punto de entrada principal para la aplicación frontend del test.
// Gestiona la navegación global, el theming y el estado de nivel superior.

import { CompletionModal } from "@/pages/CompletionModal";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";
import { AnalyticsDashboard } from "@/pages/AnalyticsDashboard";
import { HomePage } from "@/pages/HomePage";
import { TestPage } from "@/pages/TestPage";
import { config } from "@pocopi/config";
import mime from "mime";
import { JSX, ReactNode, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserData } from "./types/user";

// Enum para todas las páginas/rutas posibles en la app
// Permite navegación type-safe y fácil extensión
enum Page {
  HOME,
  TEST,
  END,
  DASHBOARD,
}

/**
 * ThemeHandler
 * Establece el tema de Bootstrap (claro/oscuro) en el root del documento según el contexto.
 * Esto asegura un theming consistente en todos los componentes.
 */
function ThemeHandler({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    // Establece el atributo de tema de Bootstrap para el estilo global
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return <>{children}</>;
}

/**
 * App
 * Componente principal de la aplicación. Gestiona la navegación, el estado global y el theming.
 * Utiliza páginas y componentes modularizados para claridad y mantenibilidad.
 */
export function App(): JSX.Element {
  // Grupo para la prueba (puede extenderse para A/B testing, etc.)
  const [group] = useState(config.sampleGroup());
  // Página actual (estado de navegación)
  const [page, setPage] = useState<Page>(Page.HOME);
  // Datos del estudiante recogidos del formulario (null si no ha comenzado)
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    document.title = config.title;

    const head = document.querySelector("head")!;
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = mime.getType(config.icon.src)!;
    link.href = config.icon.src;
    head.appendChild(link);
  }, []);

  /**
   * Handler para iniciar la prueba después de recoger los datos del estudiante.
   * @param data - Objeto UserData del formulario
   */
  const startTest = (data: UserData) => {
    setUserData(data);
    setPage(Page.TEST);
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
        return (
          <HomePage
            groupLabel={group.label}
            onStartTest={startTest}
            onDashboard={goToDashboard}
          />);
      case Page.TEST:
        // Página del test: lógica principal y UI de la prueba
        return (
          <TestPage
            group={group}
            goToNextPage={() => setPage(Page.END)}
            userData={userData!}
          />
        );
      case Page.END:
        // Modal de finalización: se muestra tras terminar la prueba
        return (
          <CompletionModal userData={userData} onBackToHome={goToHome}/>
        );
      case Page.DASHBOARD:
        // Dashboard de analíticas: muestra resultados y analíticas
        return <AnalyticsDashboard onBack={goToHome}/>;
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
