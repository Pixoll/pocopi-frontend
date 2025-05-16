// Página del test de matrices de Raven modularizada y comentada
// Usa hooks y componentes presentacionales para separar lógica y UI

import { config } from "@pocopi/config";
import { Container, Row, Col } from "react-bootstrap";
import { useTheme } from "@/hooks/useTheme";
import { useRavenMatrixTest } from "@/hooks/useRavenMatrixTest";
import RavenMatrixHeader from "@/components/RavenMatrix/RavenMatrixHeader";
import RavenMatrixOptions from "@/components/RavenMatrix/RavenMatrixOptions";
import RavenMatrixNavigation from "@/components/RavenMatrix/RavenMatrixNavigation";

// Props del componente principal
type RavenMatrixPageProps = {
  protocol: string;
  goToNextPage: () => void;
  studentData?: {
    name: string;
    id: string;
    email: string;
    age: string;
  } | null;
};

export function RavenMatrixPage({
  protocol,
  goToNextPage,
  studentData,
}: RavenMatrixPageProps) {
  // Hook para saber el tema actual (oscuro o claro)
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Hook personalizado para manejar la lógica del test
  const {
    phase,
    question,
    selected,
    img,
    options,
    optionsColumns,
    progressPercentage,
    questions,
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    handleOptionClick,
  } = useRavenMatrixTest(protocol, studentData ?? null);

  // Render principal
  return (
    <Container
      fluid
      className="p-0 min-vh-100 position-relative d-flex flex-column"
    >
      {/* Header con barra de progreso */}
      <RavenMatrixHeader
        isDarkMode={isDarkMode}
        phase={phase}
        phasesCount={config.protocols[protocol].phases.length}
        question={question}
        questionsCount={questions.length}
        progressPercentage={progressPercentage}
      />

      {/* Contenido principal */}
      <Container className="py-4 flex-grow-1 d-flex flex-column justify-content-center">
        {/* Imagen de la pregunta */}
        <Row className="justify-content-center mb-3">
          <Col md={10} lg={8} className="text-center">
            <div
              className={`p-4 rounded-4 mb-4 ${
                isDarkMode ? "bg-dark" : "bg-white"
              } shadow-sm`}
              style={{ userSelect: "none" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="img-fluid"
                style={{ maxWidth: "100%", pointerEvents: "none" }}
                draggable={false}
              />
            </div>
          </Col>
        </Row>
        {/* Opciones de respuesta */}
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <RavenMatrixOptions
              options={options}
              selected={selected}
              onOptionClick={handleOptionClick}
              optionsColumns={optionsColumns}
              isDarkMode={isDarkMode}
            />
          </Col>
        </Row>
      </Container>

      {/* Navegación inferior */}
      <RavenMatrixNavigation
        phase={phase}
        phasesCount={config.protocols[protocol].phases.length}
        question={question}
        questionsCount={questions.length}
        onPreviousPhase={goToPreviousPhase}
        onNextPhase={() => goToNextPhase(goToNextPage)}
        onPreviousQuestion={goToPreviousQuestion}
        onNextQuestion={() => goToNextQuestion(goToNextPage)}
        disablePrevious={phase === 0 && question === 0}
        disableNextPhase={phase >= config.protocols[protocol].phases.length - 1}
        isDarkMode={isDarkMode}
      />

      {/* Estilos CSS personalizados */}
      <style>{`
        .selected-option img {
          border-color: ${
            isDarkMode ? "#ffc107 !important" : "#ffc107 !important"
          };
          box-shadow: 0 0 8px rgba(255, 193, 7, 0.5);
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
}
