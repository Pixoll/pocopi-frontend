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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<DashboardTab>(DashboardTab.PARTICIPANTS);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardResponse = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`);

      if (!dashboardResponse.ok) {
        console.error(await dashboardResponse.json()?.catch(() => dashboardResponse.text()));
        setError("Error al cargar los resultados. Por favor, actualiza la página.");
        setLoading(false);
        return;
      }

      const summary = await dashboardResponse.json() as Summary;

      setSummary(summary);
      setLoading(false);

      if (summary.users.length === 0) {
        setError("No se encontraron resultados. Los usuarios deben completar el test para ver los resultados aquí.");
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("Error al cargar los resultados. Por favor, actualiza la página.");
      setLoading(false);
    }
  };

  // const exportToCSV = () => {
  //   try {
  //     let csv = "ID Participante,Grupo,Nombre,Email,Fecha,Tiempo Total (s),Respuestas Correctas,Total Preguntas,Precisión %\n";
  //
  //     participants.forEach((p) => {
  //       csv += `${p.userId},${p.group},${p.name},${p.email || "N/A"},${p.date},`;
  //       csv += `${p.totalTime.toFixed(2)},${p.totalCorrect},${p.totalQuestions},${p.correctPercentage.toFixed(1)}\n`;
  //     });
  //
  //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.setAttribute("hidden", "");
  //     a.setAttribute("href", url);
  //     a.setAttribute("download", "resultados_test.csv");
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error("Error exportando CSV:", error);
  //     setError("Error al exportar los datos como CSV.");
  //   }
  // };
  //
  // const exportUserTimelogs = (userId: string) => {
  //   const userTimelogs = timelogs.get(userId);
  //   if (!userTimelogs) return;
  //
  //   try {
  //     const participant = participants.find(p => p.userId === userId);
  //     const exportData = {
  //       participant: {
  //         id: userId,
  //         group: participant?.group || "Desconocido",
  //         name: participant?.name || "Anónimo",
  //         email: participant?.email || "N/A",
  //         totalTime: participant?.totalTime || 0,
  //         totalCorrect: participant?.totalCorrect || 0,
  //         totalQuestions: participant?.totalQuestions || 0,
  //         correctPercentage: participant?.correctPercentage || 0
  //       },
  //       timelogs: userTimelogs
  //     };
  //
  //     const json = JSON.stringify(exportData, null, 2);
  //     const blob = new Blob([json], { type: "application/json" });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.setAttribute("hidden", "");
  //     a.setAttribute("href", url);
  //     a.setAttribute("download", `participante_${userId}_resultados.json`);
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error("Error exportando datos del participante:", error);
  //     setError(`Error al exportar los datos del participante ${userId}.`);
  //   }
  // };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3"/>
          <p>{config.t("dashboard.loadingResults")}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className={`p-4 min-vh-100 ${isDarkMode ? "bg-dark text-light" : "bg-light"
      }`}
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
              <Card className={`border-0 shadow-sm ${isDarkMode ? "bg-dark" : ""}`}>
                <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-bottom-0 pt-4">
                  <h5 className="mb-0">{config.t("dashboard.testResults")}</h5>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      // onClick={exportToCSV}
                      className="me-2"
                      disabled={summary.users.length === 0}
                    >
                      <FontAwesomeIcon icon={faDownload} className="me-2"/>
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
                              // onClick={() => exportUserTimelogs(user.id)}
                              title={config.t("dashboard.exportParticipantResult")}
                            >
                              <FontAwesomeIcon icon={faFileExport}/>
                            </Button>
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey={DashboardTab.SUMMARY} title={config.t("dashboard.summary")}>
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
    <Card
      className={`border-0 h-100 ${isDarkMode ? "bg-dark bg-opacity-50 border-secondary" : "bg-white"
      }`}
    >
      <Card.Body className="d-flex align-items-center">
        <div
          className={`me-3 p-3 rounded-circle ${isDarkMode ? "bg-primary bg-opacity-10" : "bg-light"
          }`}
        >
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
