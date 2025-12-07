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
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLogout from "@/components/UserLogout.tsx";

type TestPageProps = {
  config: TrimmedConfig;
  attempt: UserTestAttempt | null;
  goToNextPage: () => void;
};

export function TestPage({ config, attempt, goToNextPage }: TestPageProps) {
  const { isDarkMode } = useTheme();
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const popState = () => {
      window.history.pushState(null, "", window.location.href);
      alert("No puedes volver a la página anterior");
    };

    window.addEventListener("popstate", popState);

    return () => {
      window.removeEventListener("popstate", popState);
    };
  }, []);
    // sino esta logeado
  useEffect(() => {
    if (!isLoggedIn) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoggedIn, navigate]);
  
  // sino existe un intento
  useEffect(() => {
    if (isLoggedIn && !attempt) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoggedIn, attempt, navigate]);

  if (!isLoggedIn) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.info}>No has iniciado sesión...</p>
            <p className={styles.redirectText}>Redirigiendo al inicio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>No hay un intento de test activo...</p>
            <p className={styles.redirectText}>Redirigiendo al inicio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (attempt.completedTest) {
    goToNextPage();
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.loadingContainer}>
            <p>Test completado exitosamente ✓</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute config={config}>
      <UserLogout />
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
  } = useTest(attempt);

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
