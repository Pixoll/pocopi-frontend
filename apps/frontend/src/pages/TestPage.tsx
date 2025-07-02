import type { User } from "@/api";
import { PhaseSummaryModal } from "@/components/TestPage/PhaseSummaryModal";
import { TestOptions } from "@/components/TestPage/TestOptions";
import { TestPageHeader } from "@/components/TestPage/TestPageHeader";
import { TestPageNavigation } from "@/components/TestPage/TestPageNavigation";
import { useTest } from "@/hooks/useTest";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/TestPage/TestPage.module.css";
import type { Group } from "@pocopi/config";
import { useEffect } from "react";

type TestPageProps = {
  group: Group;
  goToNextPage: () => void;
  userData: User;
};

export function TestPage({
  group,
  goToNextPage,
  userData,
}: TestPageProps) {
  const { isDarkMode } = useTheme();

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
    phasesCount,
    allowPreviousPhase,
    isNextPhaseHidden,
    allowPreviousQuestion,
    isNextQuestionDisabled,
    showSummary,
    answers,
    quitSummary,
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    onOptionClick,
    onOptionHover,
    jumpToQuestion,
  } = useTest(group, userData);
  useEffect(() => {
    console.log("Permite retroceder en preguntas:", allowPreviousQuestion);
    console.log("Permite retroceder en fases:", allowPreviousPhase);
  }, [allowPreviousQuestion, allowPreviousPhase]);

  return (
    <div className={styles.page}>
      <TestPageHeader
        isDarkMode={isDarkMode}
        phase={phaseIndex}
        phasesCount={phasesCount}
        question={questionIndex}
        questionsCount={totalPhaseQuestions}
        progressPercentage={progressPercentage}
      />

      {showSummary ? (
        <div className={styles.content}>
          <PhaseSummaryModal
            group={group}
            answers={answers}
            currentPhase={phaseIndex}
            phasesCount={phasesCount}
            onlyCurrentPhase={!allowPreviousPhase}
            allowJump={allowPreviousQuestion}
            jumpToQuestion={jumpToQuestion}
            onContinue={() => quitSummary(goToNextPage)}
          />
        </div>
      ) : (
        <>
          {/* main content */}
          <div className={styles.content}>
            {/* question */}
            <div
              className={[
                styles.question,
                isDarkMode ? styles.dark : styles.light,
              ].join(" ")}
            >
              {questionText && (
                <div className={questionImage ? styles.questionText : ""}>
                  {questionText}
                </div>
              )}
              {questionImage && (
                <img
                  src={questionImage.src}
                  alt={questionImage.alt}
                  className={styles.questionImage}
                  draggable={false}
                />
              )}
            </div>

            {/* options */}
            <TestOptions
              options={options}
              selected={selectedOptionId}
              onOptionClick={onOptionClick}
              onOptionHover={onOptionHover}
              optionsColumns={optionsColumns}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* bottom nav bar */}
          <TestPageNavigation
            onPreviousPhase={goToPreviousPhase}
            onNextPhase={() => goToNextPhase(goToNextPage)}
            onPreviousQuestion={goToPreviousQuestion}
            onNextQuestion={() => goToNextQuestion(goToNextPage)}
            disablePreviousPhase={phaseIndex === 0}
            disablePreviousQuestion={phaseIndex === 0 && questionIndex === 0}
            disableNextQuestion={isNextQuestionDisabled}
            disableNextPhase={phaseIndex >= phasesCount - 1}
            hidePreviousPhase={!allowPreviousPhase}
            hidePreviousQuestion={!allowPreviousQuestion}
            hideNextPhase={isNextPhaseHidden}
            isDarkMode={isDarkMode}
          />
        </>
      )}
    </div>
  );
}
