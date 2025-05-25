// Página del test de matrices de Raven modularizada y comentada
// Usa hooks y componentes presentacionales para separar lógica y UI

import { RavenMatrixHeader } from "@/components/RavenMatrix/RavenMatrixHeader";
import { RavenMatrixNavigation } from "@/components/RavenMatrix/RavenMatrixNavigation";
import { RavenMatrixOptions } from "@/components/RavenMatrix/RavenMatrixOptions";
import { useRavenMatrixTest } from "@/hooks/useRavenMatrixTest";
import { useTheme } from "@/hooks/useTheme";
import { Group } from "@pocopi/config";
import { Col, Container, Row } from "react-bootstrap";

// Props del componente principal
type RavenMatrixPageProps = {
  group: Group;
  goToNextPage: () => void;
  studentData?: {
    name: string;
    id: string;
    email: string;
    age: string;
  } | null;
};

export function RavenMatrixPage({
  group,
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
    // questionText,
    questionImage,
    options,
    optionsColumns,
    progressPercentage,
    questions,
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    handleOptionClick,
  } = useRavenMatrixTest(group, studentData ?? null);

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
        phasesCount={group.protocol.phases.length}
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
              {/* TODO add text */}
              {questionImage && (
                <img
                  src={questionImage.src}
                  alt={questionImage.alt}
                  className="img-fluid"
                  style={{ maxWidth: "100%", pointerEvents: "none" }}
                  draggable={false}
                />
              )}
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
        phasesCount={group.protocol.phases.length}
        question={question}
        questionsCount={questions.length}
        onPreviousPhase={goToPreviousPhase}
        onNextPhase={() => goToNextPhase(goToNextPage)}
        onPreviousQuestion={goToPreviousQuestion}
        onNextQuestion={() => goToNextQuestion(goToNextPage)}
        disablePrevious={phase === 0 && question === 0}
        disableNextPhase={phase >= group.protocol.phases.length - 1}
        isDarkMode={isDarkMode}
      />

      {/* Estilos CSS personalizados */}
      <style>{`
        
      `}</style>
    </Container>
  );
}
