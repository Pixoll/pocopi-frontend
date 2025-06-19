import { useState } from "react";
import { TestOptions } from "@/components/TestPage/TestOptions";
import { TestPageHeader } from "@/components/TestPage/TestPageHeader";
import { TestPageNavigation } from "@/components/TestPage/TestPageNavigation";
import { useTest } from "@/hooks/useTest";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/TestPage/TestPage.module.css";
import { UserData } from "@/types/user";
import { Group } from "@pocopi/config";
import { PhaseSummaryModal } from "@/components/TestPage/PhaseSummaryModal";

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
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    handleOptionClick,
    handleOptionHover,
    answeredQuestions,
    jumpToQuestion,
  } = useTest(group, userData);
  
  const [showSummary, setShowSummary] = useState(false);
  const [isLastPhase, setIsLastPhase] = useState(false);
  
  const handleNextPhase = () => {
    const shouldShowBetweenPhases = !allowPreviousPhase && allowPreviousQuestion;
    const atFinalPhase = phaseIndex >= phasesCount - 1;
    
    setIsLastPhase(atFinalPhase);
    
    if (shouldShowBetweenPhases || atFinalPhase) {
      setShowSummary(true);
    } else {
      goToNextPhase(goToNextPage);
    }
  };
  
  const handleContinueFromSummary = () => {
    if (isLastPhase) {
      goToNextPage(); // va al CompletionModal
    } else {
      goToNextPhase(goToNextPage);
    }
    setShowSummary(false);
  };
  
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
        onNextPhase={handleNextPhase}
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
      
      {showSummary && (
        <PhaseSummaryModal
          questions={answeredQuestions}
          onSelectQuestion={(index) => {
            jumpToQuestion(index);
            setShowSummary(false);
          }}
          onContinue={handleContinueFromSummary}
        />
      )}
    </div>
  );
}
