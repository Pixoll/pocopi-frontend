import api, {type AssignedTestGroup, type TrimmedConfig, type User} from "@/api";
import { CompletionHeader } from "@/components/CompletionModal/CompletionHeader";
import { CompletionResults } from "@/components/CompletionModal/CompletionResults";
import { CompletionUserInfo } from "@/components/CompletionModal/CompletionUserInfo";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionModal.module.css";
import { faHome, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {t} from "@/utils/translations.ts";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {useState, useEffect} from "react";

type CompletionModalProps = {
  config: TrimmedConfig;
  group: AssignedTestGroup | null;
  onBackToHome: () => void;
};

export function CompletionModal({
                                  config,
                                  group,
                                  onBackToHome,
                                }: CompletionModalProps) {
  const { isDarkMode } = useTheme();
  const { token } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.getCurrentUser({auth: token});
          setUser(response.data ?? null);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUser();
  }, [token]);

  return (
    <div className={styles.page}>
      <div className={styles.modal}>
        <CompletionHeader config={config} />

        <div className={styles.modalContentContainer}>
          <h5 className={styles.thankYou}>
            {t(config, "completion.thankYou") + (user?.username || '')}
          </h5>
          <p className={styles.completedTest}>
            {t(config, "completion.successfullyCompleted", config.title)}
          </p>

          <CompletionUserInfo config={config} userData={user}/>

          <CompletionResults config={config} userData={user} group={group}/>

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