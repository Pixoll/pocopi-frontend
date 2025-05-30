// Página principal del test

import { DashboardButton } from "@/components/HomePage/DashboardButton";
import { HomeHeader } from "@/components/HomePage/HomeHeader";
import { HomeInfoCard } from "@/components/HomePage/HomeInfoCard";
import { StudentFormModal } from "@/components/HomePage/StudentFormModal";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useStudentTest } from "@/hooks/useStudentTest";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/HomePage.module.css";
import { StudentData } from "@/types/student";

// Props que recibe el HomePage
type HomePageProps = {
  onStartTest: (data: StudentData) => void;
  onDashboard: () => void;
};

// Componente principal de la página de inicio
export function HomePage({ onStartTest, onDashboard }: HomePageProps) {
  // Usamos el hook personalizado para manejar la lógica del test y formulario
  const {
    showModal,
    consentAccepted,
    studentData,
    handleStartTest,
    handleCloseModal,
    handleConsentChange,
    handleFormSubmit,
  } = useStudentTest();
  // Hook para saber el tema actual (oscuro o claro)
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Función que inicia el test si hay datos y consentimiento
  const startTest = () => {
    if (studentData && consentAccepted) {
      onStartTest(studentData);
    }
  };

  // Renderizado principal del componente
  return (
    <div className={styles.container}>
      {/* Header de la página */}
      <HomeHeader isDarkMode={isDarkMode}/>

      {/* Tarjeta principal con información, consentimiento y botones */}
      <HomeInfoCard
        isDarkMode={isDarkMode}
        studentData={studentData}
        consentAccepted={consentAccepted}
        onConsentChange={handleConsentChange}
        onStartTest={handleStartTest}
        onBeginAssessment={startTest}
      />

      {/* Modal para ingresar datos del estudiante */}
      <StudentFormModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleFormSubmit}
      />

      {/* Botón flotante para acceder al dashboard de administración */}
      <DashboardButton isDarkMode={isDarkMode} onDashboard={onDashboard}/>

      {/* Switch para cambiar el tema */}
      <ThemeSwitcher/>
    </div>
  );
}
