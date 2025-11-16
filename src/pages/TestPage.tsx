import type { TrimmedConfig, UserTestAttempt } from "@/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PhaseSummaryModal } from "@/components/TestPage/PhaseSummaryModal";
import { TestOptions } from "@/components/TestPage/TestOptions";
import { TestPageHeader } from "@/components/TestPage/TestPageHeader";
import { TestPageNavigation } from "@/components/TestPage/TestPageNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTest } from "@/hooks/useTest";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/TestPage/TestPage.module.css";

type TestPageProps = {
  config: TrimmedConfig;
  attempt: UserTestAttempt | null;
  goToNextPage: () => void;
};

export function TestPage({ config, attempt, goToNextPage }: TestPageProps) {
  const { isDarkMode } = useTheme();
  const { token } = useAuth();

  if (!attempt) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <p>Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (attempt.completedTest) {
    goToNextPage();
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <p>Test ya fue completado</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute config={config}>
      <TestPageContent
        token={token!}
        config={config}
        attempt={attempt}
        goToNextPage={goToNextPage}
        isDarkMode={isDarkMode}
      />
    </ProtectedRoute>
  );
}

function TestPageContent({
  token,
  config,
  attempt,
  goToNextPage,
  isDarkMode,
}: {
  token: string;
  config: TrimmedConfig;
  attempt: UserTestAttempt;
  goToNextPage: () => void;
  isDarkMode: boolean;
}) {
  const {
    phaseIndex,
    questionIndex,
    selectedOptionId,
    answers,
    showSummary,
    showedSummary,
    quitSummary,
    goToSummary,
    goToPreviousQuestion,
    goToNextQuestion,
    onOptionClick,
    onOptionHover,
    jumpToQuestion,
  } = useTest(attempt, token);

  const group = attempt.assignedGroup;
  const { phases } = group;
  const phase = phases[phaseIndex];
  const question = phase.questions[questionIndex];

  return (
    <div className={styles.page}>
      <TestPageHeader
        config={config}
        phases={phases}
        phaseIndex={phaseIndex}
        questionIndex={questionIndex}
        showSummary={showSummary}
      />

      {showSummary ? (
        <div className={styles.content}>
          <PhaseSummaryModal
            config={config}
            protocol={group}
            answers={answers}
            phaseIndex={phaseIndex}
            jumpToQuestion={jumpToQuestion}
            onContinue={() => quitSummary(goToNextPage)}
          />
        </div>
      ) : (
        <>
          <div className={styles.content}>
            <div
              className={[
                styles.question,
                isDarkMode ? styles.dark : styles.light,
              ].join(" ")}
            >
              {question.text && (
                <div className={question.image ? styles.questionText : ""}>
                  {question.text}
                </div>
              )}
              {question.image && (
                <img
                  src={question.image.url}
                  alt={question.image.alt}
                  className={styles.questionImage}
                  draggable={false}
                />
              )}
            </div>

            {/* options */}
            <TestOptions
              options={question.options}
              selected={selectedOptionId}
              onOptionClick={onOptionClick}
              onOptionHover={onOptionHover}
            />
          </div>

          <TestPageNavigation
            config={config}
            protocol={group}
            phaseIndex={phaseIndex}
            questionIndex={questionIndex}
            isOptionSelected={selectedOptionId !== null}
            showedSummary={showedSummary}
            goToSummary={goToSummary}
            onPreviousQuestion={goToPreviousQuestion}
            onNextQuestion={goToNextQuestion}
          />
        </>
      )}
    </div>
  );
}
