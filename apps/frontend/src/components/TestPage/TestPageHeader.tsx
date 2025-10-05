import {type Phase, type SingleConfigResponse} from "@/api";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/TestPage/TestPageHeader.module.css";
import {t} from "@/utils/translations.ts";

type TestPageHeaderProps = {
  config: SingleConfigResponse;
  phases: readonly Phase[];
  phaseIndex: number;
  questionIndex: number;
  showSummary: boolean;
};

export function TestPageHeader({
  config,
  phases,
  phaseIndex,
  questionIndex,
  showSummary,
}: TestPageHeaderProps) {
  const { isDarkMode } = useTheme();

  const phase = phases[phaseIndex];
  const totalTestQuestions = phases.reduce((acc, phase) => acc + phase.questions.length, 0);
  const currentQuestionNumber = (showSummary ? 1 : 0)
    + questionIndex
    + phases
      .slice(0, phaseIndex)
      .reduce((acc, phase) => acc + phase.questions.length, 0);

  const progressPercentage = (currentQuestionNumber / totalTestQuestions) * 100;

  return (
    <div
      className={[
        styles.headerContainer,
        isDarkMode ? styles.headerDark : styles.headerLight,
      ].join(" ")}
    >
      <h5 className={styles.title}>
        {/*<img className={styles.icon} src={config.icon.src} alt={config.icon.alt}/>*/}
        <span>{config.title}</span>
      </h5>
      <div className={styles.progressBarContainer}>
        <small className={styles.progressText}>{t(config, "test.progress")}</small>
        <div className={styles.progressBar}>
          <div
            className={styles.progressBarFill}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <small>{Math.floor(progressPercentage)}%</small>
      </div>
      <div className={styles.progressBadgeContainer}>
        <span className={styles.progressBadge}>
          {t(config, 
            "test.phaseQuestion",
            `${phaseIndex + 1}`,
            `${phases.length}`,
            `${questionIndex + 1}`,
            `${phase.questions.length}`
          )}
        </span>
      </div>
    </div>
  );
}
