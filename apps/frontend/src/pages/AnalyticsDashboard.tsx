import { Timelog } from "@/analytics/TestAnalytics";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faChartLine,
  faCheckCircle,
  faDownload,
  faExclamationTriangle,
  faFileExport,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner, Tab, Table, Tabs } from "react-bootstrap";

enum DashboardTab {
  PARTICIPANTS = "participants",
  SUMMARY = "summary",
}

type Summary = {
  averageAccuracy: number;
  averageTimeTaken: number;
  totalQuestionsAnswered: number;
  users: UserSummary[];
};

type UserSummary = {
  id: string;
  name: string;
  email?: string;
  age?: number;
  group: string;
  timestamp: number;
  timeTaken: number;
  correctQuestions: number;
  questionsAnswered: number;
  accuracy: number;
};

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
  const [loadingExportSummary, setLoadingExportSummary] = useState<boolean>(false);
  const [loadingExportUserTimelogs, setLoadingExportUserTimelogs] = useState<boolean>(false);
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

      const dashboardResponse = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`);

      if (!dashboardResponse.ok) {
        console.error(await dashboardResponse.json()?.catch(() => dashboardResponse.text()));
        setError(config.t("dashboard.errorLoadingResults"));
      } else {
        const summary = await dashboardResponse.json() as Summary;
        setSummary(summary);

        if (summary.users.length === 0) {
          setError(config.t("dashboard.errorNoResults"));
        }
      }
    } catch (error) {
      console.error("error while loading dashboard:", error);
      setError(config.t("dashboard.errorLoadingResults"));
    } finally {
      setLoadingSummary(false);
    }
  };

  const exportToCSV = () => {
    try {
      setLoadingExportSummary(true);
      setError(null);

      const rows = [
        [
          "user_id",
          "group",
          "name",
          "email",
          "age",
          "date",
          "time_taken",
          "correct_questions",
          "questions_answered",
          "accuracy",
        ].join(","),
      ];

      summary.users.forEach((u) => {
        rows.push([
          u.id,
          u.group,
          escapeCsvValue(u.name),
          escapeCsvValue(u.email ?? "-"),
          u.age ?? "-",
          new Date(u.timestamp).toISOString(),
          (u.timeTaken / 1000).toFixed(2),
          u.correctQuestions,
          u.questionsAnswered,
          u.accuracy.toFixed(1),
        ].join(","));
      });

      const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "test_results.csv");
      a.click();
    } catch (error) {
      console.error("Error exportando CSV:", error);
      setError(config.t("dashboard.exportCsv"));
    } finally {
      setLoadingExportSummary(false);
    }
  };

  const exportUserTimelogs = async (user: UserSummary) => {
    try {
      setLoadingExportUserTimelogs(true);
      setError(null);

      const timelogsResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}/timelogs`);

      if (!timelogsResponse.ok) {
        console.error(await timelogsResponse.json()?.catch(() => timelogsResponse.text()));
        setError(config.t("dashboard.errorExportUser", user.id));
      } else {
        const timelogs = await timelogsResponse.json() as Timelog[];

        const exportData = {
          participant: user,
          timelogs: timelogs,
        };

        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", `user_${user.id}_results.json`);
        a.click();
      }
    } catch (error) {
      console.error("error while exporting user:", error);
      setError(config.t("dashboard.errorExportUser", user.id));
    } finally {
      setLoadingExportUserTimelogs(false);
    }
  };

  return (
    <Container
      fluid
      className={`p-4 min-vh-100 ${isDarkMode ? "bg-dark text-light" : "bg-light"}`}
    >
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="d-flex align-items-center">
              <FontAwesomeIcon
                icon={faChartLine}
                className="me-2 text-primary"
              />
              {config.t("dashboard.analytics", config.title)}
            </h2>
            <Button
              variant={isDarkMode ? "outline-light" : "outline-dark"}
              onClick={onBack}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
              {config.t("dashboard.backToHome")}
            </Button>
          </div>
          <p className="text-secondary">
            {config.t("dashboard.viewAndExportResults")}
          </p>
        </Col>
      </Row>

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

      {/* Pestañas para diferentes vistas */}
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
                : (
                  <Card className={`border-0 shadow-sm ${isDarkMode ? "bg-dark" : ""}`}>
                    <Card.Header
                      className="d-flex justify-content-between align-items-center bg-transparent border-bottom-0 pt-4"
                    >
                      <h5 className="mb-0">{config.t("dashboard.testResults")}</h5>
                      <div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={exportToCSV}
                          className="me-2"
                          disabled={loadingExportSummary || summary.users.length === 0}
                        >
                          {loadingExportSummary
                            ? <Spinner className="me-2" style={{ height: "1em", width: "1em" }}/>
                            : <FontAwesomeIcon icon={faDownload} className="me-2"/>
                          }
                          {config.t("dashboard.exportCsv")}
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body className="px-0 pt-0">
                      {summary.users.length === 0 ? (
                        <div className="text-center py-5">
                          <p className="text-muted mb-0">
                            {config.t("dashboard.noResults")}
                          </p>
                        </div>
                      ) : (
                        <Table
                          responsive
                          hover
                          className={isDarkMode ? "table-dark" : ""}
                        >
                          <thead>
                          <tr>
                            <th>{config.t("dashboard.participant")}</th>
                            <th>{config.t("dashboard.group")}</th>
                            <th>{config.t("dashboard.date")}</th>
                            <th>{config.t("dashboard.timeTaken")}</th>
                            <th>{config.t("dashboard.correct")}</th>
                            <th>{config.t("dashboard.total")}</th>
                            <th>{config.t("dashboard.accuracy")}</th>
                            <th>{config.t("dashboard.actions")}</th>
                          </tr>
                          </thead>
                          <tbody>
                          {summary.users.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div
                                    className={`p-2 rounded-circle me-2 ${isDarkMode
                                      ? "bg-primary bg-opacity-10"
                                      : "bg-light"
                                    }`}
                                  >
                                    <FontAwesomeIcon
                                      icon={faUser}
                                      className="text-primary"
                                    />
                                  </div>
                                  <div>
                                    <div className="fw-medium">
                                      {user.name}
                                    </div>
                                    <small className="text-secondary">
                                      {config.t("dashboard.id", user.id)}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>{user.group}</td>
                              <td>{new Date(user.timestamp).toLocaleString()}</td>
                              <td>{(user.timeTaken / 1000).toFixed(2)}</td>
                              <td>{user.correctQuestions}</td>
                              <td>{user.questionsAnswered}</td>
                              <td>
                                <Badge
                                  bg={getAccuracyBadgeColor(user.accuracy)}
                                  className="px-2 py-1"
                                >
                                  {user.accuracy.toFixed(1)}%
                                </Badge>
                              </td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => exportUserTimelogs(user)}
                                  disabled={loadingExportUserTimelogs}
                                  title={config.t("dashboard.exportParticipantResult")}
                                >
                                  {loadingExportUserTimelogs
                                    ? <Spinner style={{ height: "1em", width: "1em" }}/>
                                    : <FontAwesomeIcon icon={faFileExport}/>
                                  }
                                </Button>
                              </td>
                            </tr>
                          ))}
                          </tbody>
                        </Table>
                      )}
                    </Card.Body>
                  </Card>
                )
              }
            </Tab>

            <Tab eventKey={DashboardTab.SUMMARY} title={config.t("dashboard.summary")}>
              {loadingSummary
                ? <LoadingIndicator/>
                : (
                  <Card className={`border-0 shadow-sm ${isDarkMode ? "bg-dark" : ""}`}>
                    <Card.Body>
                      <Row className="g-4">
                        <Col md={6} lg={3}>
                          <StatCard
                            title={config.t("dashboard.totalParticipants")}
                            value={summary.users.length.toString()}
                            icon={faUser}
                            isDarkMode={isDarkMode}
                          />
                        </Col>
                        <Col md={6} lg={3}>
                          <StatCard
                            title={config.t("dashboard.averageAccuracy")}
                            value={`${summary.averageAccuracy.toFixed(1)}%`}
                            icon={faCheckCircle}
                            isDarkMode={isDarkMode}
                          />
                        </Col>
                        <Col md={6} lg={3}>
                          <StatCard
                            title={config.t("dashboard.averageTimeTaken")}
                            value={`${(summary.averageTimeTaken / 1000).toFixed(1)} seg`}
                            icon={faChartLine}
                            isDarkMode={isDarkMode}
                          />
                        </Col>
                        <Col md={6} lg={3}>
                          <StatCard
                            title={config.t("dashboard.totalQuestionsAnswered")}
                            value={`${summary.totalQuestionsAnswered}`}
                            icon={faChartLine}
                            isDarkMode={isDarkMode}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )
              }
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <ThemeSwitcher/>
    </Container>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  icon: IconProp;
  isDarkMode: boolean;
};

function StatCard({ title, value, icon, isDarkMode }: StatCardProps) {
  return (
    <Card className={`border-0 h-100 ${isDarkMode ? "bg-dark bg-opacity-50 border-secondary" : "bg-white"}`}>
      <Card.Body className="d-flex align-items-center">
        <div className={`me-3 p-3 rounded-circle ${isDarkMode ? "bg-primary bg-opacity-10" : "bg-light"}`}>
          <FontAwesomeIcon icon={icon} className="text-primary fa-lg"/>
        </div>
        <div>
          <h6 className="text-secondary mb-1">{title}</h6>
          <h4 className="mb-0">{value}</h4>
        </div>
      </Card.Body>
    </Card>
  );
}

function getAccuracyBadgeColor(accuracy: number): string {
  if (accuracy >= 90) return "success";
  if (accuracy >= 70) return "primary";
  if (accuracy >= 50) return "warning";
  return "danger";
}

function escapeCsvValue(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, "\"\"")}"` : value;
}
