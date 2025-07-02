import dotsBg from "@/assets/dotsBg.svg";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionHeader.module.css";
import { faCheck, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";

export function CompletionHeader() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={[
        styles.header,
        isDarkMode ? styles.headerDark : styles.headerLight,
      ].join(" ")}
      style={{ backgroundImage: `url('${dotsBg}')` }}
    >
      <FontAwesomeIcon
        icon={faTrophy}
        className={[
          styles.headerIcon,
          isDarkMode ? styles.headerIconDark : styles.headerIconLight,
        ].join(" ")}
      />

      <h2 className={styles.headerTitle}>
        {config.t("completion.testCompleted")}
      </h2>

      <div
        className={[
          styles.headerBadge,
          isDarkMode ? styles.headerBadgeDark : styles.headerBadgeLight,
        ].join(" ")}
      >
        <FontAwesomeIcon icon={faCheck}/>
        {config.t("completion.successfullySubmitted")}
      </div>
    </div>
  );
}
