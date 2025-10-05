import { useTheme } from "@/hooks/useTheme";
import type {Protocol, SingleConfigResponse} from "@/api";
import styles from "@/styles/TestPage/TestPageNavigation.module.css";
import { faAngleLeft, faAngleRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {t} from "@/utils/translations.ts";
// import { config, type Protocol } from "@pocopi/config";

type TestPageNavigationProps = {
  config: SingleConfigResponse;
  protocol: Protocol;
  phaseIndex: number;
  questionIndex: number;
  isOptionSelected: boolean;
  showedSummary: boolean;
  goToSummary: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
};

export function TestPageNavigation({
  config,
  protocol,
  phaseIndex,
  questionIndex,
  isOptionSelected,
  showedSummary,
  goToSummary,
  onPreviousQuestion,
  onNextQuestion,
}: TestPageNavigationProps) {
  const { isDarkMode } = useTheme();

  const { allowPreviousPhase, allowPreviousQuestion, allowSkipQuestion } = protocol;

  const disablePreviousQuestion = allowPreviousPhase
    ? phaseIndex === 0 && questionIndex === 0
    : questionIndex === 0;
  const disableNextQuestion = !allowSkipQuestion && !isOptionSelected;

  return (
    <div
      className={[
        styles.navigationContainer,
        isDarkMode ? styles.dark : styles.light,
      ].join(" ")}
    >
      <div className={styles.navGroup}>
        <button
          className={[styles.navButton, styles.primaryOutline].join(" ")}
          onClick={onPreviousQuestion}
          disabled={disablePreviousQuestion}
          hidden={!allowPreviousQuestion}
        >
          <FontAwesomeIcon icon={faAngleLeft} className={styles.iconLeft}/>
          {t(config, "test.previousQuestion")}
        </button>

        <button
          className={[styles.navButton, styles.primary].join(" ")}
          onClick={onNextQuestion}
          disabled={disableNextQuestion}
        >
          {t(config, "test.nextQuestion")}
          <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight}/>
        </button>
      </div>

      <button
        className={[styles.navButton, styles.secondaryOutline, styles.backToSummaryButton].join(" ")}
        onClick={goToSummary}
        hidden={!showedSummary}
      >
        {t(config, "test.backToSummary")}
        <FontAwesomeIcon icon={faArrowRight} className={styles.iconRight}/>
      </button>
    </div>
  );
}
