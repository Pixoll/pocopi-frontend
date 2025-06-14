import api, { Summary } from "@/api";
import { DashboardHeader } from "@/components/DashboardPage/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardPage/DashboardSummary";
import { ParticipantsList } from "@/components/DashboardPage/ParticipantsList";
import { Spinner } from "@/components/Spinner";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/DashboardPage/DashboardPage.module.css";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

enum DashboardTab {
  PARTICIPANTS = "participants",
  SUMMARY = "summary",
}

type AnalyticsDashboardProps = {
  onBack: () => void;
};

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<Summary>({
    averageAccuracy: 0,
    averageTimeTaken: 0,
    totalQuestionsAnswered: 0,
    users: [],
  });
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingSummary(true);
      setError(null);

      const { data: summary } = await api.getSummary();
      setSummary(summary);

      if (summary.users.length === 0) {
        setError(config.t("dashboard.errorNoResults"));
      }
    } catch (error) {
      console.error("error while loading dashboard:", error);
      setError(config.t("dashboard.errorLoadingResults"));
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
      <DashboardHeader isDarkMode={isDarkMode} onBack={onBack}/>

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
        <Tab eventKey={DashboardTab.PARTICIPANTS} title={config.t("dashboard.participantsList")}>
          {loadingSummary
            ? <LoadingIndicator/>
            : <ParticipantsList isDarkMode={isDarkMode} summary={summary} setError={setError}/>
          }
        </Tab>

        <Tab eventKey={DashboardTab.SUMMARY} title={config.t("dashboard.summary")}>
          {loadingSummary
            ? <LoadingIndicator/>
            : <DashboardSummary isDarkMode={isDarkMode} summary={summary}/>
          }
        </Tab>
      </Tabs>

      <ThemeSwitcher/>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className={styles.loadingIndicator}>
      <Spinner className={styles.spinner}/>
      <p>{config.t("dashboard.loadingResults")}</p>
    </div>
  );
}
