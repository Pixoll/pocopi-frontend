import { Timelog } from "@/analytics/TestAnalytics";
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

type UserSummary = {
  userId: string;
  name: string;
  timestamp: number;
  date: string;
  totalTime: number;
  totalCorrect: number;
  correctPercentage: number;
};

type AnalyticsDashboardProps = {
  onBack: () => void;
};

/**
 * Simple dashboard to view test results
 */
export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [timelogs, setTimelogs] = useState(new Map<string, Timelog[]>());
  const [participants, setParticipants] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("participants");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    loadTimelogs();
  }, []);

  const loadTimelogs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Getting timelogs from backend");

      const response = await fetch("${import.meta.env.VITE_API_URL}/timelog");

      if (!response.ok) {
        setLoading(false);
        console.error("Error loading test results:", await response.json());
        setError("Failed to load test results. Please try refreshing the page.");
        return;
      }

      const results = await response.json() as Timelog[];

      const newTimelogs = new Map<string, Timelog[]>();
      const userSummaries = new Map<string, UserSummary>();

      for (const timelog of results) {
        const userTimelogs = newTimelogs.get(timelog.userId);
        if (!userTimelogs) {
          newTimelogs.set(timelog.userId, [timelog]);
        } else {
          userTimelogs.push(timelog);
        }

        // TODO eventually we should also get the user data, which should have their name and assigned group

        const totalQuestions = 4;

        const userSummary = userSummaries.get(timelog.userId);
        if (!userSummary) {
          const correct = timelog.correct ? 1 : 0;

          userSummaries.set(timelog.userId, {
            userId: timelog.userId,
            name: "Unknown",
            timestamp: timelog.startTimestamp,
            date: new Date(timelog.startTimestamp).toLocaleString(),
            totalTime: (timelog.endTimestamp - timelog.startTimestamp) / 1000,
            totalCorrect: correct,
            correctPercentage: (correct / totalQuestions) * 100,
          });
        } else {
          if (timelog.correct) {
            userSummary.totalCorrect++;
            userSummary.correctPercentage = (userSummary.totalCorrect / totalQuestions) * 100;
          }

          if (timelog.startTimestamp < userSummary.timestamp) {
            userSummary.timestamp = timelog.startTimestamp;
            userSummary.date = new Date(timelog.startTimestamp).toLocaleString();
          }

          userSummary.totalTime = Math.max(userSummary.totalTime, (timelog.endTimestamp - userSummary.timestamp) / 1000);
        }
      }

      setTimelogs(newTimelogs);
      setParticipants(Array.from(userSummaries.values()));
      setLoading(false);

      if (userSummaries.size === 0) {
        setError(
          "No test results found. Have students complete the test to see results here."
        );
      }
    } catch (error) {
      console.error("Error loading test results:", error);
      setError("Failed to load test results. Please try refreshing the page.");
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    try {
      let csv = "Participant ID,Name,Date,Total Time (s),Correct Answers,Accuracy %\n";

      participants.forEach((p) => {
        csv += `${p.userId},${p.name},${p.date},`;
        csv += `${p.totalTime.toFixed(2)},${
          p.totalCorrect
        },${p.correctPercentage.toFixed(1)}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "test_results.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError("Failed to export data as CSV.");
    }
  };

  const exportUserTimelogs = (userId: string) => {
    const userTimelogs = timelogs.get(userId);
    if (!userTimelogs) return;

    try {
      const json = JSON.stringify(userTimelogs, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `participant_${userId}.json`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting participant data:", error);
      setError(`Failed to export data for participant ${userId}.`);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3"/>
          <p>Loading test results...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className={`p-4 min-vh-100 ${
        isDarkMode ? "bg-dark text-light" : "bg-light"
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
              {config.title} Analytics
            </h2>
            <Button
              variant={isDarkMode ? "outline-light" : "outline-dark"}
              onClick={onBack}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
              Back to Home
            </Button>
          </div>
          <p className="text-secondary">
            View and export test results from participants.
          </p>
        </Col>
      </Row>

      {/* Error alert if needed */}
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

      {/* Tabs for different views */}
      <Row className="mb-4">
        <Col>
          <Tabs
            id="dashboard-tabs"
            activeKey={selectedTab}
            onSelect={(k) => k && setSelectedTab(k)}
            className={isDarkMode ? "text-white" : ""}
          >
            <Tab eventKey="participants" title="Participants List">
              <Card
                className={`border-0 shadow-sm ${isDarkMode ? "bg-dark" : ""}`}
              >
                <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-bottom-0 pt-4">
                  <h5 className="mb-0">Test Results</h5>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={exportToCSV}
                      className="me-2"
                      disabled={participants.length === 0}
                    >
                      <FontAwesomeIcon icon={faDownload} className="me-2"/>
                      Export CSV
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="px-0 pt-0">
                  {participants.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted mb-0">
                        No test results available yet
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
                        <th>Participant</th>
                        <th>Date</th>
                        <th>Time (s)</th>
                        <th>Correct</th>
                        <th>Accuracy</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {participants.map((participant) => (
                        <tr key={participant.userId}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className={`p-2 rounded-circle me-2 ${
                                  isDarkMode
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
                                  {participant.name}
                                </div>
                                <small className="text-secondary">
                                  {participant.userId}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>{participant.date}</td>
                          <td>{participant.totalTime.toFixed(2)}</td>
                          <td>{participant.totalCorrect}</td>
                          <td>
                            <Badge
                              bg={getAccuracyBadgeColor(
                                participant.correctPercentage
                              )}
                              className="px-2 py-1"
                            >
                              {participant.correctPercentage.toFixed(1)}%
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                exportUserTimelogs(
                                  participant.userId
                                )
                              }
                              title="Export detailed results"
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

            {/* You can add more tabs here if needed in the future */}
            <Tab eventKey="summary" title="Summary">
              <Card
                className={`border-0 shadow-sm ${isDarkMode ? "bg-dark" : ""}`}
              >
                <Card.Body>
                  <Row className="g-4">
                    <Col md={6} lg={3}>
                      <StatCard
                        title="Total Participants"
                        value={participants.length.toString()}
                        icon={faUser}
                        isDarkMode={isDarkMode}
                      />
                    </Col>
                    <Col md={6} lg={3}>
                      <StatCard
                        title="Average Accuracy"
                        value={`${calculateAverageAccuracy(participants)}%`}
                        icon={faCheckCircle}
                        isDarkMode={isDarkMode}
                      />
                    </Col>
                    <Col md={6} lg={3}>
                      <StatCard
                        title="Average Time"
                        value={`${calculateAverageTime(participants)} sec`}
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

// Helper component for stat cards
type StatCardProps = {
  title: string;
  value: string;
  icon: IconProp;
  isDarkMode: boolean;
};

function StatCard({ title, value, icon, isDarkMode }: StatCardProps) {
  return (
    <Card
      className={`border-0 h-100 ${
        isDarkMode ? "bg-dark bg-opacity-50 border-secondary" : "bg-white"
      }`}
    >
      <Card.Body className="d-flex align-items-center">
        <div
          className={`me-3 p-3 rounded-circle ${
            isDarkMode ? "bg-primary bg-opacity-10" : "bg-light"
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

// Helper function to determine badge color based on accuracy
function getAccuracyBadgeColor(accuracy: number): string {
  if (accuracy >= 90) return "success";
  if (accuracy >= 70) return "primary";
  if (accuracy >= 50) return "warning";
  return "danger";
}

// Helper function to calculate average accuracy
function calculateAverageAccuracy(participants: UserSummary[]): string {
  if (participants.length === 0) return "0.0";

  const total = participants.reduce((sum, p) => sum + p.correctPercentage, 0);
  return (total / participants.length).toFixed(1);
}

// Helper function to calculate average time
function calculateAverageTime(participants: UserSummary[]): string {
  if (participants.length === 0) return "0.0";

  const total = participants.reduce((sum, p) => sum + p.totalTime, 0);
  return (total / participants.length).toFixed(1);
}
