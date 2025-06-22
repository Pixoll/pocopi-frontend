import { CompletionHeader } from "@/components/CompletionModal/CompletionHeader";
import { CompletionResults } from "@/components/CompletionModal/CompletionResults";
import { CompletionUserInfo } from "@/components/CompletionModal/CompletionUserInfo";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionModal.module.css";
import type { UserData } from "@/types/user";
import { faHome, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";

type CompletionModalProps = {
  userData: UserData;
  onBackToHome: () => void;
};

export function CompletionModal({
  userData,
  onBackToHome,
}: CompletionModalProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={styles.page}>
      <div className={styles.modal}>
        <CompletionHeader/>

        <div className={styles.modalContentContainer}>
          <h5 className={styles.thankYou}>
            {config.t("completion.thankYou", !userData.anonymous ? userData.name : "")}
          </h5>
          <p className={styles.completedTest}>
            {config.t("completion.successfullyCompleted", config.title)}
          </p>

          {!userData.anonymous && (
            <CompletionUserInfo userData={userData}/>
          )}

          <CompletionResults userData={userData}/>

          <p
            className={[
              styles.resultsRecorded,
              isDarkMode ? styles.resultsRecordedDark : styles.resultsRecordedLight,
            ].join(" ")}
          >
            {config.t("completion.resultsRecorded")}
          </p>

          <button
            className={[
              styles.homeButton,
              isDarkMode ? styles.homeButtonDark : styles.homeButtonLight,
            ].join(" ")}
            onClick={onBackToHome}
          >
            <FontAwesomeIcon icon={faHome}/>
            {config.t("completion.backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
