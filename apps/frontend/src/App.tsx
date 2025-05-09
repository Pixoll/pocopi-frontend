import { JSX, useState, useEffect } from "react";
import { RavenMatrixPage } from "@/pages/RavenMatrixPage.tsx";
import HomePage from "@/pages/HomePage";
import CompletionModal from "@/components/CompletionModal";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";
import "bootstrap/dist/css/bootstrap.min.css";

enum Page {
  HOME,
  RAVEN_MATRIX,
  END,
}

interface StudentData {
  name: string;
  id: string;
  email: string;
  age: string;
}

// Componente para establecer el tema en el documento
const ThemeHandler = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Establece el atributo data-bs-theme para Bootstrap
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return <>{children}</>;
};

export default function App(): JSX.Element {
  const [protocol] = useState<string>("control");
  const [page, setPage] = useState<Page>(Page.HOME);
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  const startTest = (data: StudentData) => {
    setStudentData(data);
    setPage(Page.RAVEN_MATRIX);
  };

  const goToHome = () => {
    setPage(Page.HOME);
  };

  const renderPage = () => {
    switch (page) {
      case Page.HOME:
        return <HomePage onStartTest={startTest} />;
      case Page.RAVEN_MATRIX:
        return (
          <RavenMatrixPage
            protocol={protocol}
            goToNextPage={() => setPage(Page.END)}
          />
        );
      case Page.END:
        return (
          <CompletionModal studentData={studentData} onBackToHome={goToHome} />
        );
    }
  };

  return (
    <ThemeProvider>
      <ThemeHandler>{renderPage()}</ThemeHandler>
    </ThemeProvider>
  );
}
