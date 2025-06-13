import api from "@/api";
import { DashboardHeader } from "@/components/DashboardPage/DashboardHeader";
import { DashboardSummary } from "@/components/DashboardPage/DashboardSummary";
import { ParticipantsList } from "@/components/DashboardPage/ParticipantsList";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";
import { Summary } from "@/types/summary";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Tab, Tabs } from "react-bootstrap";

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
  const [selectedTab, setSelectedTab] = useState<DashboardTab>(DashboardTab.PARTICIPANTS);
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
    <Container
      fluid
      className={`p-4 min-vh-100 ${isDarkMode ? "bg-dark text-light" : "bg-light"}`}
    >
      <DashboardHeader isDarkMode={isDarkMode} onBack={onBack}/>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="warning" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2"/>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col>
          <Tabs
            id="dashboard-tabs"
            activeKey={selectedTab}
            onSelect={(k) => k && setSelectedTab(k as DashboardTab)}
            className={isDarkMode ? "text-white" : ""}
          >
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
        </Col>
      </Row>

      <ThemeSwitcher/>
    </Container>
  );
}
