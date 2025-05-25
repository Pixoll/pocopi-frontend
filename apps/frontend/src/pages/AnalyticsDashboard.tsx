import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faChartLine,
  faUser,
  faCheckCircle,
  faExclamationTriangle,
  faFileExport,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/hooks/useTheme";
import { TestResults } from "@/utils/RavenAnalytics";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

type ParticipantSummary = {
  participantId: string;
  name: string; // Added name field from student data
  date: string; // Date when test was taken
  totalTime: number; // In seconds
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
  const [testResults, setTestResults] = useState<TestResults[]>([]);
  const [participants, setParticipants] = useState<ParticipantSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("participants");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Load data from localStorage on component mount
  useEffect(() => {
    loadTestResults();
  }, []);

  // Function to load test results from localStorage
  const loadTestResults = () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading test results from localStorage");
      const results: TestResults[] = [];
      const studentData: { [key: string]: { name: string; email: string } } =
        {};

      // First try to find student data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("student_data_")) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsedData = JSON.parse(data);
              const participantId = key.replace("student_data_", "");
              studentData[participantId] = {
                name: parsedData.name,
                email: parsedData.email,
              };
            } catch (e) {
              console.error(`Error parsing student data for ${key}:`, e);
            }
          }
        }
      }

      // Then find all test results
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("raven_test_")) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              console.log(`Found test data with key: ${key}`);
              const parsedData = JSON.parse(data) as TestResults;
              results.push(parsedData);
            } catch (e) {
              console.error(`Error parsing data for ${key}:`, e);
            }
          }
        }
      }

      // Create simplified participant summaries
      const summaries = results.map((result) => {
        const participantId = result.participantId;
        const completedQuestions = result.questions.filter(
          (q) => q.endTime !== undefined
        );
        const totalQuestions = completedQuestions.length || 1; // Avoid division by zero

        return {
          participantId,
          name: studentData[participantId]?.name || "Unknown",
          date: new Date(result.startTime).toLocaleDateString(),
          totalTime: (result.totalTime || 0) / 1000, // Convert to seconds
          totalCorrect: result.totalCorrect,
          correctPercentage: (result.totalCorrect / totalQuestions) * 100,
        };
      });

      setTestResults(results);
      setParticipants(summaries);
      setLoading(false);

      if (summaries.length === 0) {
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

  // Export participant data to CSV
  const exportToCSV = () => {
    try {
      // Create CSV header
      let csv =
        "Participant ID,Name,Date,Total Time (s),Correct Answers,Accuracy %\n";

      // Add data rows
      participants.forEach((p) => {
        csv += `${p.participantId},${p.name},${p.date},`;
        csv += `${p.totalTime.toFixed(2)},${
          p.totalCorrect
        },${p.correctPercentage.toFixed(1)}\n`;
      });

      // Create download link
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "raven_test_results.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError("Failed to export data as CSV.");
    }
  };

  // Export detailed data for a participant
  const exportParticipantData = (participantId: string) => {
    const participant = testResults.find(
      (r) => r.participantId === participantId
    );
    if (!participant) return;

    try {
      const json = JSON.stringify(participant, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `participant_${participantId}.json`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting participant data:", error);
      setError(`Failed to export data for participant ${participantId}.`);
    }
  };

  // Clear all test data (for development/testing)
  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL test data? This cannot be undone."
      )
    ) {
      // Delete all test data from localStorage
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith("raven_test_") || key.startsWith("student_data_"))
        ) {
          localStorage.removeItem(key);
        }
      }
      // Reload data (will be empty)
      loadTestResults();
    }
  };

  // Loading indicator
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
              Raven's Matrices Test Analytics
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
                    {/* Only show in development environment */}
                    {import.meta.env.DEV && (
                      <Button variant="danger" size="sm" onClick={clearAllData}>
                        Clear All Data
                      </Button>
                    )}
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
                        <tr key={participant.participantId}>
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
                                  {participant.participantId}
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
                                exportParticipantData(
                                  participant.participantId
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
function calculateAverageAccuracy(participants: ParticipantSummary[]): string {
  if (participants.length === 0) return "0.0";

  const total = participants.reduce((sum, p) => sum + p.correctPercentage, 0);
  return (total / participants.length).toFixed(1);
}

// Helper function to calculate average time
function calculateAverageTime(participants: ParticipantSummary[]): string {
  if (participants.length === 0) return "0.0";

  const total = participants.reduce((sum, p) => sum + p.totalTime, 0);
  return (total / participants.length).toFixed(1);
}
