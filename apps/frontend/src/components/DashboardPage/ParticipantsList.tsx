import { Timelog } from "@/analytics/TestAnalytics";
import { Summary, UserSummary } from "@/types/summary";
import { faDownload, faFileExport, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useState } from "react";
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap";

type ParticipantsListProps = {
  isDarkMode: boolean;
  summary: Summary;
  setError: (value: string | null) => void;
};

export function ParticipantsList({
  isDarkMode,
  summary,
  setError,
}: ParticipantsListProps) {
  const [loadingExportSummary, setLoadingExportSummary] = useState<boolean>(false);
  const [loadingExportUserTimelogs, setLoadingExportUserTimelogs] = useState<boolean>(false);

  const exportToCsv = () => {
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

      downloadFile("test_results.csv", rows.join("\n"), "text/csv;charset=utf-8;");
    } catch (error) {
      console.error("error exporting csv:", error);
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
        downloadFile(`user_${user.id}_results.json`, json, "application/json");
      }
    } catch (error) {
      console.error("error while exporting user:", error);
      setError(config.t("dashboard.errorExportUser", user.id));
    } finally {
      setLoadingExportUserTimelogs(false);
    }
  };

  return (
    <Card className={`border-0 shadow-sm ${isDarkMode ? "bg-dark" : ""}`}>
      <Card.Header
        className="d-flex justify-content-between align-items-center bg-transparent border-bottom-0 pt-4"
      >
        <h5 className="mb-0">{config.t("dashboard.testResults")}</h5>
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={exportToCsv}
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
                    <div className={`p-2 rounded-circle me-2 ${isDarkMode ? "bg-primary bg-opacity-10" : "bg-light"}`}>
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

function downloadFile(filename: string, data: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}
