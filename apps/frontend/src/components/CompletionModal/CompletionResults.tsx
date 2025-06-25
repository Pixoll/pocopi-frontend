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
        setError(config.t("completion.failedToGetResults"));
      } else {
        setUserResult({
          ...result.data,
          totalQuestions: config.getTotalQuestions(result.data.group) ?? result.data.questionsAnswered,
        });
      }
    } catch {
      setError(config.t("completion.failedToGetResults"));
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
    <div
      className={[
        styles.container,
        isDarkMode ? styles.containerDark : styles.containerLight,
      ].join(" ")}
    >
      <div className={styles.headerContainer}>
        <span className={styles.title}>
          {config.t("completion.results")}
        </span>

        <button
          className={[
            styles.showResultsButton,
            isDarkMode ? styles.primaryOutline : styles.successOutline,
          ].join(" ")}
          onClick={onShowResults}
        >
          <FontAwesomeIcon icon={faChartLine}/>
          {showResults
            ? config.t("completion.hideResults")
            : config.t("completion.viewResults")
          }
        </button>
      </div>

      {showResults && <>
        {loading && <div>{config.t("completion.gettingResults")}</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && !userResult && (
          <div>{config.t("completion.noResultsFound")}</div>
        )}

        {!loading && !error && userResult && <>
          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faCheck} className={[styles.resultIcon, styles.correctIcon].join(" ")}/>
            <strong>{config.t("completion.correctAnswers")}</strong>{" "}
            {config.t("completion.correctOfTotal", `${userResult.correctQuestions}`, `${userResult.totalQuestions}`)}
          </div>

          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faForward} className={[styles.resultIcon, styles.skippedIcon].join(" ")}/>
            <strong>{config.t("completion.skippedQuestions")}</strong>{" "}
            {userResult.totalQuestions - userResult.questionsAnswered}
          </div>

          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faPercent} className={[styles.resultIcon, styles.accuracyIcon].join(" ")}/>
            <strong>{config.t("completion.accuracyPercent")}</strong>{" "}
            {userResult.accuracy.toFixed(1)}%
          </div>

          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faClock} className={[styles.resultIcon, styles.timeIcon].join(" ")}/>
            <strong>{config.t("completion.timeTaken")}</strong>{" "}
            {config.t("completion.timeSeconds", (userResult.timeTaken / 1000).toFixed(1))}
          </div>
        </>}
      </>}
    </div>
  );
}
