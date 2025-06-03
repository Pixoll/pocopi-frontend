import { TestOptions } from "@/components/TestPage/TestOptions";
import { TestPageHeader } from "@/components/TestPage/TestPageHeader";
import { TestPageNavigation } from "@/components/TestPage/TestPageNavigation";
import { useTest } from "@/hooks/useTest";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/TestPage/TestPage.module.css";
import { UserData } from "@/types/user";
import { Group } from "@pocopi/config";

type TestPageProps = {
  group: Group;
  goToNextPage: () => void;
  userData: UserData;
};

export function TestPage({
  group,
  goToNextPage,
  userData,
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
    phasesCount,
    allowPreviousPhase,
    isNextPhaseHidden,
    allowPreviousQuestion,
    isNextQuestionDisabled,
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    handleOptionClick,
    handleOptionHover,
  } = useTest(group, userData);

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
          onOptionClick={handleOptionClick}
          onOptionHover={handleOptionHover}
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
    </div>
  );
}
