// Página del test de modularizada y comentada
// Usa hooks y componentes presentacionales para separar lógica y UI

import { TestPageHeader } from "@/components/TestPage/TestPageHeader";
import { TestPageNavigation } from "@/components/TestPage/TestPageNavigation";
import { TestOptions } from "@/components/TestPage/TestOptions";
import { useTest } from "@/hooks/useTest";
import { useTheme } from "@/hooks/useTheme";
import { Group } from "@pocopi/config";
import { Col, Container, Row } from "react-bootstrap";

// Props del componente principal
type TestPageProps = {
  group: Group;
  goToNextPage: () => void;
  studentData?: {
    name: string;
    id: string;
    email: string;
    age: string;
  } | null;
};

export function TestPage({
  group,
  goToNextPage,
  studentData,
}: TestPageProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const {
    phaseIndex,
    questionIndex,
    selectedOptionId,
    questionText,
    questionImage,
    options,
    optionsColumns,
    progressPercentage,
    totalPhaseQuestions,
    allowPreviousPhase,
    allowSkipPhase,
    allowPreviousQuestion,
    allowSkipQuestion,
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    handleOptionClick,
  } = useTest(group, studentData ?? null);

  const phasesCount = group.protocol.phases.length;

  const isNextPhaseHidden = allowSkipPhase
    ? phaseIndex >= phasesCount - 1
    : true;

  const isNextQuestionDisabled = allowSkipQuestion
    ? false
    : selectedOptionId === "";

  return (
    <Container
      fluid
      className="p-0 min-vh-100 position-relative d-flex flex-column"
    >
      <TestPageHeader
        isDarkMode={isDarkMode}
        phase={phaseIndex}
        phasesCount={phasesCount}
        question={questionIndex}
        questionsCount={totalPhaseQuestions}
        progressPercentage={progressPercentage}
      />

      {/* Contenido principal */}
      <Container className="py-4 flex-grow-1 d-flex flex-column justify-content-center">
        {/* Imagen de la pregunta */}
        <Row className="justify-content-center mb-3">
          <Col
            md={10}
            lg={8}
            className={`text-center p-4 rounded-4 mb-4 shadow-sm ${isDarkMode ? "bg-dark" : "bg-white"}`}
            style={{ userSelect: "none" }}
          >
            {questionText && (
              <div className={questionImage ? "mb-3" : ""}>{questionText}</div>
            )}
            {questionImage && (
              <img
                src={questionImage.src}
                alt={questionImage.alt}
                className="img-fluid"
                style={{ maxWidth: "100%", maxHeight: "30rem", pointerEvents: "none" }}
                draggable={false}
              />
            )}
          </Col>
        </Row>

        {/* Opciones de respuesta */}
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <TestOptions
              options={options}
              selected={selectedOptionId}
              onOptionClick={handleOptionClick}
              optionsColumns={optionsColumns}
              isDarkMode={isDarkMode}
            />
          </Col>
        </Row>
      </Container>

      {/* Navegación inferior */}
      <TestPageNavigation
        onPreviousPhase={goToPreviousPhase}
        onNextPhase={() => goToNextPhase(goToNextPage)}
        onPreviousQuestion={goToPreviousQuestion}
        onNextQuestion={() => goToNextQuestion(goToNextPage)}
        disablePreviousPhase={phaseIndex === 0}
        disablePreviousQuestion={questionIndex === 0}
        disableNextQuestion={isNextQuestionDisabled}
        hidePreviousPhase={!allowPreviousPhase}
        hidePreviousQuestion={!allowPreviousQuestion}
        hideNextPhase={isNextPhaseHidden}
        isDarkMode={isDarkMode}
      />
    </Container>
  );
}
