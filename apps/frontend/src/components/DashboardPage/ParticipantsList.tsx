import api, { Summary, UserSummary } from "@/api";
import { Spinner } from "@/components/Spinner";
import styles from "@/styles/DashboardPage/ParticipantsList.module.css";
import { faDownload, faFileExport, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useState } from "react";

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

      const response = await api.getUserTimelogs({
        path: {
          id: user.id,
        },
      });

      if (response.error) {
        console.error("error while exporting user:", response.error);
        setError(config.t("dashboard.errorExportUser", user.id));
      } else {
        const exportData = {
          participant: user,
          timelogs: response.data,
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
    <div
      className={[
        styles.container,
        isDarkMode ? styles.containerDark : styles.containerLight,
      ].join(" ")}
    >
      <div className={styles.header}>
        <h5 className={styles.title}>{config.t("dashboard.testResults")}</h5>
        <button
          onClick={exportToCsv}
          className={styles.exportCsvButton}
          disabled={loadingExportSummary || summary.users.length === 0}
        >
          {loadingExportSummary
            ? <Spinner/>
            : <FontAwesomeIcon icon={faDownload}/>
          }
          {config.t("dashboard.exportCsv")}
        </button>
      </div>

      {summary.users.length === 0 ? (
        <div
          className={[
            styles.noResults,
            isDarkMode ? styles.noResultsDark : styles.noResultsLight,
          ].join(" ")}
        >
          {config.t("dashboard.noResults")}
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table
            className={[
              styles.table,
              isDarkMode ? styles.tableDark : styles.tableLight,
            ].join(" ")}
          >
            <thead>
            <tr>
              <th>{config.t("dashboard.participant")}</th>
              <th>{config.t("dashboard.group")}</th>
              <th>{config.t("dashboard.date")}</th>
              <th>{config.t("dashboard.timeTaken")}</th>
              <th>{config.t("dashboard.correct")}</th>
              <th>{config.t("dashboard.answered")}</th>
              <th>{config.t("dashboard.accuracy")}</th>
              <th>{config.t("dashboard.actions")}</th>
            </tr>
            </thead>
            <tbody>
            {summary.users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userContainer}>
                    <FontAwesomeIcon
                      icon={faUser}
                      className={[
                        styles.userIcon,
                        isDarkMode ? styles.userIconDark : styles.userIconLight,
                      ].join(" ")}
                    />
                    <div>
                      <div className={styles.userName}>
                        {user.name}
                      </div>
                      <small className={styles.userId}>
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
                  <div className={[styles.accuracyBadge, getAccuracyBadgeClass(user.accuracy)].join(" ")}>
                    {user.accuracy.toFixed(1)}%
                  </div>
                </td>
                <td>
                  <button
                    className={styles.exportUserButton}
                    onClick={() => exportUserTimelogs(user)}
                    disabled={loadingExportUserTimelogs}
                    title={config.t("dashboard.exportParticipantResult")}
                  >
                    {loadingExportUserTimelogs
                      ? <Spinner/>
                      : <FontAwesomeIcon icon={faFileExport}/>
                    }
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getAccuracyBadgeClass(accuracy: number): string {
  if (accuracy >= 90) return styles.accuracy90;
  if (accuracy >= 70) return styles.accuracy70;
  if (accuracy >= 50) return styles.accuracy50;
  return styles.accuracyLow;
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
