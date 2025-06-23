import api, { type User, type UserSummary } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionResults.module.css";
import { faChartLine, faCheck, faClock, faForward, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useState } from "react";

type UserResult = UserSummary & {
  totalQuestions: number;
};

type CompletionResultsProps = {
  userData: User;
};

export function CompletionResults({ userData }: CompletionResultsProps) {
  const { isDarkMode } = useTheme();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userResult, setUserResult] = useState<UserResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserResult = async () => {
    if (userResult) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.getUserSummary({
        path: {
          userId: userData.id,
        }
      });

      if (!result.data) {
        setError("No se pudo obtener el resultado. Intenta de nuevo.");
      } else {
        setUserResult({
          ...result.data,
          totalQuestions: config.getTotalQuestions(result.data.group) ?? result.data.questionsAnswered,
        });
      }
    } catch {
      setError("No se pudo obtener el resultado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const onShowResults = () => {
    if (!showResults) {
      fetchUserResult();
    }

    setShowResults((prev) => !prev);
  };

  return (
    <div className={[
      styles.container,
      isDarkMode ? styles.containerDark : styles.containerLight,
    ].join(" ")}>
      <div className={styles.headerContainer}>
        <span className={styles.title}>Resultados del test</span>

        <button
          className={[
            styles.showResultsButton,
            isDarkMode ? styles.primaryOutline : styles.successOutline,
          ].join(" ")}
          onClick={onShowResults}
        >
          <FontAwesomeIcon icon={faChartLine}/>
          {showResults ? "Ocultar Resultados" : config.t("completion.viewResults")}
        </button>
      </div>

      {showResults && <>
        {loading && <div>Obteniendo resultados...</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && !userResult && (
          <div>No se encontraron resultados para este usuario.</div>
        )}

        {!loading && !error && userResult && <>
          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faCheck} className={[styles.resultIcon, styles.correctIcon].join(" ")}/>
            <strong>Preguntas correctas:</strong>{" "}
            {userResult.correctQuestions} de {userResult.totalQuestions}
          </div>

          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faForward} className={[styles.resultIcon, styles.skippedIcon].join(" ")}/>
            <strong>Preguntas omitidas:</strong>{" "}
            {userResult.totalQuestions - userResult.questionsAnswered}
          </div>

          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faPercent} className={[styles.resultIcon, styles.accuracyIcon].join(" ")}/>
            <strong>Porcentaje de aciertos:</strong>{" "}
            {userResult.accuracy.toFixed(1)}%
          </div>

          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faClock} className={[styles.resultIcon, styles.timeIcon].join(" ")}/>
            <strong>Tiempo total:</strong>{" "}
            {(userResult.timeTaken / 1000).toFixed(1)} segundos
          </div>
        </>}
      </>}
    </div>
  );
}
