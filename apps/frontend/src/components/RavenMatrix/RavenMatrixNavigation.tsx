// Componente para la navegación inferior del test (fases y preguntas)

import { faAngleLeft, faArrowLeft, faArrowRight, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/RavenMatrix/RavenMatrixNavigation.module.css";
import classNames from "classnames";

type RavenMatrixNavigationProps = {
  phase: number;
  phasesCount: number;
  question: number;
  questionsCount: number;
  onPreviousPhase: () => void;
  onNextPhase: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  disablePrevious: boolean;
  disableNextPhase: boolean;
  isDarkMode: boolean;
};

export function RavenMatrixNavigation({
  onPreviousPhase,
  onNextPhase,
  onPreviousQuestion,
  onNextQuestion,
  disablePrevious,
  disableNextPhase,
  isDarkMode,
}: RavenMatrixNavigationProps) {
  return (
    <div
      className={classNames(
        styles.navigationContainer,
        isDarkMode ? styles.dark : styles.light
      )}
    >
      <div className={styles.navGroup}>
        <button
          className={classNames(styles.navButton, styles.secondary)}
          onClick={onPreviousPhase}
          disabled={disablePrevious}
        >
          <FontAwesomeIcon icon={faArrowLeft} className={styles.iconLeft}/>
          Previous Phase
        </button>
      </div>
      
      <div className={styles.navGroup}>
        <button
          className={classNames(styles.navButton, styles.primaryOutline)}
          onClick={onPreviousQuestion}
          disabled={disablePrevious}
        >
          <FontAwesomeIcon icon={faAngleLeft} className={styles.iconLeft}/>
          Previous
        </button>
        <button
          className={classNames(styles.navButton, styles.primary)}
          onClick={onNextQuestion}
        >
          Next
          <FontAwesomeIcon icon={faArrowRight} className={styles.iconRight}/>
        </button>
      </div>
      
      <div className={styles.navGroup}>
        <button
          className={classNames(styles.navButton, styles.secondary)}
          onClick={onNextPhase}
          disabled={disableNextPhase}
        >
          Next Phase
          <FontAwesomeIcon icon={faArrowRight} className={styles.iconRight}/>
        </button>
      </div>
    </div>
  );
}
