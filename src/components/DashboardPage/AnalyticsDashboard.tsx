import api, { type TrimmedConfig, type UsersTestAttemptsSummary } from "@/api";
import { DashboardHeader } from "@/components/DashboardPage/DashboardHeader.tsx";
import { DashboardSummary } from "@/components/DashboardPage/DashboardSummary.tsx";
import { ParticipantsList } from "@/components/DashboardPage/ParticipantsList.tsx";
import { Spinner } from "@/components/Spinner.tsx";
import { ThemeSwitcher } from "@/components/ThemeSwitcher.tsx";
import { useTheme } from "@/hooks/useTheme.ts";
import styles from "@/styles/DashboardPage/DashboardPage.module.css";
import { t } from "@/utils/translations.ts";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

enum DashboardTab {
  PARTICIPANTS = "participants",
  SUMMARY = "summary",
}

type AnalyticsDashboardProps = {
  config: TrimmedConfig;
  onBack: () => void;
  adminToken: string;
};

export function AnalyticsDashboard({ config, onBack }: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<UsersTestAttemptsSummary>({
    averageAccuracy: 0,
    averageTimeTaken: 0,
    totalQuestionsAnswered: 0,
    users: [],
  });
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoadingSummary(true);
      setError(null);

      const response = await api.getAllUsersTestAttemptsSummary();

      if (!response.data) {
        setError(t(config, "dashboard.errorLoadingResults"));
      } else {
        setSummary(response.data);
        if (response.data.users?.length === 0) {
          setError(t(config, "dashboard.errorNoResults"));
        }
      }
    } catch (error) {
      console.error("error while loading dashboard:", error);
      setError(t(config, "dashboard.errorLoadingResults"));
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div
      className={[
        styles.container,
        isDarkMode ? styles.containerDark : styles.containerLight,
      ].join(" ")}
    >
      <DashboardHeader config={config} isDarkMode={isDarkMode} onBack={onBack}/>

      {error && (
        <div
          className={[
            styles.warning,
            isDarkMode ? styles.warningDark : styles.warningLight,
          ].join(" ")}
        >
          <FontAwesomeIcon icon={faExclamationTriangle}/>
          {error}
        </div>
      )}

      <Tabs>
        <Tab eventKey={DashboardTab.PARTICIPANTS} title={t(config, "dashboard.participantsList")}>
          {loadingSummary
            ? <LoadingIndicator config={config}/>
            : <ParticipantsList config={config} isDarkMode={isDarkMode} summary={summary} setError={setError}/>
          }
        </Tab>

        <Tab eventKey={DashboardTab.SUMMARY} title={t(config, "dashboard.summary")}>
          {loadingSummary
            ? <LoadingIndicator config={config}/>
            : <DashboardSummary config={config} isDarkMode={isDarkMode} summary={summary}/>
          }
        </Tab>
      </Tabs>

      <ThemeSwitcher config={config}/>
    </div>
  );
}

function LoadingIndicator({ config }: { config: TrimmedConfig }) {
  return (
    <div className={styles.loadingIndicator}>
      <Spinner className={styles.spinner}/>
      <p>{t(config, "dashboard.loadingResults")}</p>
    </div>
  );
}
