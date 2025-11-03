import type {TrimmedConfig, AssignedTestGroup} from "@/api";
import { PhaseSummaryModal } from "@/components/TestPage/PhaseSummaryModal";
import { TestOptions } from "@/components/TestPage/TestOptions";
import { TestPageHeader } from "@/components/TestPage/TestPageHeader";
import { TestPageNavigation } from "@/components/TestPage/TestPageNavigation";
import { useTest } from "@/hooks/useTest";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext.tsx";
import styles from "@/styles/TestPage/TestPage.module.css";

type TestPageProps = {
  config: TrimmedConfig;
  protocol: AssignedTestGroup | null;
  goToNextPage: () => void;
};

export function TestPage({
                           config,
                           protocol,
                           goToNextPage,
                         }: TestPageProps) {
  const { isDarkMode } = useTheme();
  const { token } = useAuth();

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <p>Se necesita autenticarse primero</p>
        </div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <p>Cargando preguntas....</p>
        </div>
      </div>
    );
  }

  return <TestPageContent
    token={token}
    config={config}
    protocol={protocol}
    goToNextPage={goToNextPage}
    isDarkMode={isDarkMode}
  />;
}

function TestPageContent({
                           token,
                           config,
                           protocol,
                           goToNextPage,
                           isDarkMode,
                         }: {
  token: string
  config: TrimmedConfig;
  protocol: AssignedTestGroup;
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
  } = useTest(protocol,token);

  const { phases } = protocol;
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
            protocol={protocol}
            answers={answers}
            phaseIndex={phaseIndex}
            jumpToQuestion={jumpToQuestion}
            onContinue={() => quitSummary(goToNextPage)}
          />
        </div>
      ) : <>
        {/* main content */}
        <div className={styles.content}>
          {/* question */}
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

        {/* bottom nav bar */}
        <TestPageNavigation
          config={config}
          protocol={protocol}
          phaseIndex={phaseIndex}
          questionIndex={questionIndex}
          isOptionSelected={selectedOptionId !== null}
          showedSummary={showedSummary}
          goToSummary={goToSummary}
          onPreviousQuestion={goToPreviousQuestion}
          onNextQuestion={goToNextQuestion}
        />
      </>}
    </div>
  );
}