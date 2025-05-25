// Página principal del test de matrices progresivas de Raven

import { useTheme } from "@/hooks/useTheme";
import { useStudentTest } from "@/hooks/useStudentTest";
import { StudentData } from "@/types/student";
import { Container } from "react-bootstrap";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import StudentFormModal from "@/components/HomePage/StudentFormModal";
import HomeHeader from "@/components/HomePage/HomeHeader";
import HomeInfoCard from "@/components/HomePage/HomeInfoCard";
import DashboardButton from "@/components/HomePage/DashboardButton";

// Props que recibe el HomePage
interface HomePageProps {
  onStartTest: (data: StudentData) => void;
  onDashboard: () => void;
}

// Componente principal de la página de inicio
const HomePage = ({ onStartTest, onDashboard }: HomePageProps) => {
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
    <Container
      fluid
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-5"
      style={{ maxWidth: 1200 }} // Limita el ancho máximo del contenido principal
    >
      {/* Header de la página */}
      <HomeHeader/>

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
      <DashboardButton isDarkMode={isDarkMode} onDashboard={onDashboard} />

      {/* Switch para cambiar el tema */}
      <ThemeSwitcher />
    </Container>
  );
};

export default HomePage;
