import api, { type AssignedTestGroup, type TrimmedConfig, type User } from "@/api";
import { CompletionHeader } from "@/components/CompletionModal/CompletionHeader";
import { CompletionResults } from "@/components/CompletionModal/CompletionResults";
import { CompletionUserInfo } from "@/components/CompletionModal/CompletionUserInfo";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionModal.module.css";
import { t } from "@/utils/translations.ts";
import { faHome, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type CompletionModalProps = {
  config: TrimmedConfig;
  group?: AssignedTestGroup | null;
  onBackToHome: () => void;
};

export function CompletionModal({
                                  config,
                                  group,
                                  onBackToHome,
                                }: CompletionModalProps) {
  const { isDarkMode } = useTheme();
  const { token, isAdmin, clearAuth} = useAuth();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const popState = () => {
      window.history.pushState(null, "", window.location.href);
      alert("No puedes volver a la página anterior");
    };

    window. addEventListener("popstate", popState);

    return () => {
      window.removeEventListener("popstate", popState);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.getCurrentUser({auth:token});
          console.log(response)
          setUser(response.data ?? null);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUser();
  }, [token]);

  const goToHome = () => {
    clearAuth();
    onBackToHome();
  };

  return (
    <div className={styles.page}>
      <div className={styles.modal}>
        <CompletionHeader config={config}/>

        <div className={styles.modalContentContainer}>
          <h5 className={styles.thankYou}>
            {t(config, "completion.thankYou", config.anonymous ? "" : user?.username ? user.username : "")}
          </h5>
          <p className={styles.completedTest}>
            {t(config, "completion.successfullyCompleted", config.title)}
          </p>

          <CompletionUserInfo
            config={config}
            userData={user}
            isAdmin={isAdmin}
          />

          <CompletionResults config={config} userData={user} group={group}/>

          <p
            className={[
              styles.resultsRecorded,
              isDarkMode ? styles. resultsRecordedDark : styles.resultsRecordedLight,
            ].join(" ")}
          >
            {t(config, "completion.resultsRecorded")}
          </p>

          <button
            className={[
              styles.homeButton,
              isDarkMode ?  styles.homeButtonDark : styles.homeButtonLight,
            ].join(" ")}
            onClick={goToHome}
          >
            <FontAwesomeIcon icon={faHome}/>
            {t(config, "completion.backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
