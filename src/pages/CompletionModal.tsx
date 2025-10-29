import type {NewUser, Config} from "@/api";
import { CompletionHeader } from "@/components/CompletionModal/CompletionHeader";
import { CompletionResults } from "@/components/CompletionModal/CompletionResults";
import { CompletionUserInfo } from "@/components/CompletionModal/CompletionUserInfo";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionModal.module.css";
import { faHome, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {t} from "@/utils/translations.ts";

type CompletionModalProps = {
  config: Config
  userData: NewUser;
  onBackToHome: () => void;
};

export function CompletionModal({
  config,
  userData,
  onBackToHome,
}: CompletionModalProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={styles.page}>
      <div className={styles.modal}>
        <CompletionHeader config={config} />

        <div className={styles.modalContentContainer}>
          <h5 className={styles.thankYou}>
            {t(config, "completion.thankYou") + userData.name}
          </h5>
          <p className={styles.completedTest}>
            {t(config, "completion.successfullyCompleted", config.title)}
          </p>

          <CompletionUserInfo config={config} userData={userData}/>

          <CompletionResults config={config}  userData={userData}/>

          <p
            className={[
              styles.resultsRecorded,
              isDarkMode ? styles.resultsRecordedDark : styles.resultsRecordedLight,
            ].join(" ")}
          >
            {t(config, "completion.resultsRecorded")}
          </p>

          <button
            className={[
              styles.homeButton,
              isDarkMode ? styles.homeButtonDark : styles.homeButtonLight,
            ].join(" ")}
            onClick={onBackToHome}
          >
            <FontAwesomeIcon icon={faHome}/>
            {t(config, "completion.backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
