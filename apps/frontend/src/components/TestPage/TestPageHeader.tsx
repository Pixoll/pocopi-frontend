import styles from "@/styles/TestPage/TestPageHeader.module.css";
import { config } from "@pocopi/config";
import { ProgressBar } from "react-bootstrap";

type TestPageHeaderProps = {
  isDarkMode: boolean;
  phase: number;
  phasesCount: number;
  question: number;
  questionsCount: number;
  progressPercentage: number;
};

export function TestPageHeader({
  isDarkMode,
  phase,
  phasesCount,
  question,
  questionsCount,
  progressPercentage,
}: TestPageHeaderProps) {
  return (
    <div
      className={[
        styles.headerContainer,
        isDarkMode ? styles.headerDark : styles.headerLight,
      ].join(" ")}
    >
      <h4 className={styles.title}>
        <img className={styles.icon} src={config.icon.src} alt={config.icon.alt}/>
        <span>{config.title}</span>
      </h4>
      <div className={styles.progressBarContainer}>
        <small className={styles.progressText}>Progress:</small>
        <ProgressBar
          now={progressPercentage}
          className={styles.progressBar}
          variant="primary"
        />
        <small>{Math.floor(progressPercentage)}%</small>
      </div>
      <div className={styles.progressBadgeContainer}>
        <span className={styles.progressBadge}>
          Phase {phase + 1}/{phasesCount} - Question {question + 1}/
          {questionsCount}
        </span>
      </div>
    </div>
  );
}
