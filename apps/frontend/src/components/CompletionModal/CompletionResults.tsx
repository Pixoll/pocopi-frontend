import api, {type CreateUserRequest, type SingleConfigResponse, type UserSummary} from "@/api";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionResults.module.css";
import { faChartLine, faCheck, faClock, faForward, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {t} from "@/utils/translations.ts";

type UserResult = UserSummary & {
  totalQuestions: number;
};

type CompletionResultsProps = {
  config: SingleConfigResponse;
  userData: CreateUserRequest;
};

export function CompletionResults({ config, userData }: CompletionResultsProps) {
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
      const result = await api.getUserSummaryById({
        path: {
          userId: +userData.username,
        }
      });

      if (!result.data) {
        setError(t(config, "completion.failedToGetResults"));
      } else {
        setUserResult({
          ...result.data,
          totalQuestions: config.groups[result.data.group].protocol.phases.reduce((acc, phase )=>acc+(phase.questions.length), 0) ?? result.data.questionsAnswered,
        });
      }
    } catch {
      setError(t(config, "completion.failedToGetResults"));
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
          {t(config, "completion.results")}
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
            ? t(config, "completion.hideResults")
            : t(config, "completion.viewResults")
          }
        </button>
      </div>

      {showResults && <>
        {loading && <div>{t(config, "completion.gettingResults")}</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && !userResult && (
          <div>{t(config, "completion.noResultsFound")}</div>
        )}

        {!loading && !error && userResult && <>
          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faCheck} className={[styles.resultIcon, styles.correctIcon].join(" ")}/>
            <strong>{t(config, "completion.correctAnswers")}</strong>{" "}
            {t(config, "completion.correctOfTotal", `${userResult.correctQuestions}`, `${userResult.totalQuestions}`)}
          </div>

          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faForward} className={[styles.resultIcon, styles.skippedIcon].join(" ")}/>
            <strong>{t(config, "completion.skippedQuestions")}</strong>{" "}
            {userResult.totalQuestions - userResult.questionsAnswered}
          </div>

          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faPercent} className={[styles.resultIcon, styles.accuracyIcon].join(" ")}/>
            <strong>{t(config, "completion.accuracyPercent")}</strong>{" "}
            {userResult.accuracy.toFixed(1)}%
          </div>

          <div className={styles.resultContainer}>
            <FontAwesomeIcon icon={faClock} className={[styles.resultIcon, styles.timeIcon].join(" ")}/>
            <strong>{t(config, "completion.timeTaken")}</strong>{" "}
            {t(config, "completion.timeSeconds", (userResult.timeTaken / 1000).toFixed(1))}
          </div>
        </>}
      </>}
    </div>
  );
}
