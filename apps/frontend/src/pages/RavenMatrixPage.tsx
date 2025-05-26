// Página del test de matrices de Raven modularizada y comentada
// Usa hooks y componentes presentacionales para separar lógica y UI

import { RavenMatrixHeader } from "@/components/RavenMatrix/RavenMatrixHeader";
import { RavenMatrixNavigation } from "@/components/RavenMatrix/RavenMatrixNavigation";
import { RavenMatrixOptions } from "@/components/RavenMatrix/RavenMatrixOptions";
import { useRavenMatrixTest } from "@/hooks/useRavenMatrixTest";
import { useTheme } from "@/hooks/useTheme";
import { Group } from "@pocopi/config";
import classNames from "classnames";
import styles from "@/styles/RavenMatrixPage.module.css";

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
    <div className={styles.page}>
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
      <div className={styles.content}>
        <div className={styles.question}>
          <div
            className={classNames(
              styles.questionBox,
              isDarkMode ? styles.dark : styles.light
            )}
          >
            {questionImage && (
              <img
                src={questionImage.src}
                alt={questionImage.alt}
                className={styles.questionImage}
                draggable={false}
              />
            )}
          </div>
        </div>
        
        <div className={styles.options}>
          <RavenMatrixOptions
            options={options}
            selected={selected}
            onOptionClick={handleOptionClick}
            optionsColumns={optionsColumns}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
      
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
    </div>
  );
}
