import api, { type TrimmedConfig, type UsersTestAttemptsSummary, type UserTestAttemptSummary } from "@/api";
import { Spinner } from "@/components/Spinner";
import styles from "@/styles/DashboardPage/ParticipantsList.module.css";
import { faDownload, faEllipsisV, faUser, faFileArchive } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { t } from "@/utils/translations.ts";
import UserActionsModal from "@/components/DashboardPage/UserActionsModal.tsx";

type ParticipantsListProps = {
  config: TrimmedConfig;
  isDarkMode: boolean;
  summary: UsersTestAttemptsSummary;
  setError: (value: string | null) => void;
};

export function ParticipantsList({
                                   config,
                                   isDarkMode,
                                   summary,
                                   setError,
                                 }: ParticipantsListProps) {
  const [loadingExportSummary, setLoadingExportSummary] = useState<boolean>(false);
  const [loadingAllResults, setLoadingAllResults] = useState<boolean>(false);
  const [loadingAllTests, setLoadingAllTests] = useState<boolean>(false);
  const [loadingAllForms, setLoadingAllForms] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserTestAttemptSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
          u.user.id,
          escapeCsvValue(u.user.name ?? "-"),
          escapeCsvValue(u.user.email ?? "-"),
          u.user.age ?? "-",
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
      setError(t(config, "dashboard.exportCsv"));
    } finally {
      setLoadingExportSummary(false);
    }
  };

  const getAllUsersLatestConfigResultsZip = async () => {
    try {
      setLoadingAllResults(true);
      setError(null);
      const response = await api.getAllResults();

      if (response.error) {
        console.error("Error al exportar todos los resultados:", response.error);
        setError("Error al exportar todos los resultados");
      } else if (response.data) {
        console.log(response.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Error inesperado al exportar todos los resultados");
    } finally {
      setLoadingAllResults(false);
    }
  };

  const getAllUsersLatestConfigTestsZip = async () => {
    try {
      setLoadingAllTests(true);
      setError(null);
      const response = await api.getAllTestResults();

      if (response.error) {
        console.error("Error al exportar todos los tests:", response.error);
        setError("Error al exportar todos los tests");
      } else if (response.data) {
        console.log("Tests obtenidos:", response.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Error inesperado al exportar todos los tests");
    } finally {
      setLoadingAllTests(false);
    }
  };

  const getAllUsersLatestConfigFormsZip = async () => {
    try {
      setLoadingAllForms(true);
      setError(null);
      const response = await api.getAllFormResults();

      if (response.error) {
        console.error( response.error);
        setError("Error al exportar todos los formularios");
      } else if (response.data) {
        console.log(response.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Error inesperado al exportar todos los formularios");
    } finally {
      setLoadingAllForms(false);
    }
  };

  const openUserActionsModal = (user: UserTestAttemptSummary) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div
        className={[
          styles.container,
          isDarkMode ? styles.containerDark : styles.containerLight,
        ].join(" ")}
      >
        <div className={styles.header}>
          <h5 className={styles.title}>{t(config, "dashboard.testResults")}</h5>
          <button
            onClick={exportToCsv}
            className={styles.exportCsvButton}
            disabled={loadingExportSummary || summary.users.length === 0}
          >
            {loadingExportSummary
              ? <Spinner/>
              : <FontAwesomeIcon icon={faDownload}/>
            }
            {t(config, "dashboard.exportCsv")}
          </button>
        </div>

        <div className={styles.bulkExportSection}>
          <h6 className={styles.bulkExportTitle}>Exportar información de todos los usuarios:</h6>
          <div className={styles.bulkExportButtons}>
            <button
              onClick={getAllUsersLatestConfigResultsZip}
              className={styles.bulkExportButton}
              disabled={loadingAllResults || summary.users.length === 0}
              title="Exportar todos los resultados de usuarios"
            >
              {loadingAllResults ? (
                <Spinner />
              ) : (
                <FontAwesomeIcon icon={faFileArchive} />
              )}
              <span>Todos los Resultados</span>
            </button>

            <button
              onClick={getAllUsersLatestConfigTestsZip}
              className={styles.bulkExportButton}
              disabled={loadingAllTests || summary.users.length === 0}
              title="Exportar todos los tests de usuarios"
            >
              {loadingAllTests ? (
                <Spinner />
              ) : (
                <FontAwesomeIcon icon={faFileArchive} />
              )}
              <span>Todos los Tests</span>
            </button>

            <button
              onClick={getAllUsersLatestConfigFormsZip}
              className={styles.bulkExportButton}
              disabled={loadingAllForms || summary.users.length === 0}
              title="Exportar todos los formularios de usuarios"
            >
              {loadingAllForms ? (
                <Spinner />
              ) : (
                <FontAwesomeIcon icon={faFileArchive} />
              )}
              <span>Todos los Formularios</span>
            </button>
          </div>
        </div>

        {summary.users.length === 0 ? (
          <div
            className={[
              styles.noResults,
              isDarkMode ? styles.noResultsDark : styles.noResultsLight,
            ].join(" ")}
          >
            {t(config, "dashboard.noResults")}
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
                <th>{t(config, "dashboard.participant")}</th>
                <th>Versión de configuración</th>
                <th>{t(config, "dashboard.group")}</th>
                <th>{t(config, "dashboard.date")}</th>
                <th>{t(config, "dashboard.timeTaken")}</th>
                <th>{t(config, "dashboard.correct")}</th>
                <th>{t(config, "dashboard.answered")}</th>
                <th>{t(config, "dashboard.accuracy")}</th>
                <th>{t(config, "dashboard.actions")}</th>
              </tr>
              </thead>
              <tbody>
              {summary.users.map((userAttempt) => (
                <tr key={userAttempt.user.id}>
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
                          {userAttempt.user.name}
                        </div>
                        <small className={styles.userId}>
                          {t(config, "dashboard.id", userAttempt.user.id.toString())}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{userAttempt.configVersion}</td>
                  <td>{userAttempt.group}</td>
                  <td>{new Date(userAttempt.timestamp).toLocaleString()}</td>
                  <td>{(userAttempt.timeTaken / 1000).toFixed(2)}</td>
                  <td>{userAttempt.correctQuestions}</td>
                  <td>{userAttempt.questionsAnswered}</td>
                  <td>
                    <div className={[styles.accuracyBadge, getAccuracyBadgeClass(userAttempt.accuracy)].join(" ")}>
                      {userAttempt.accuracy.toFixed(1)}%
                    </div>
                  </td>
                  <td>
                    <button
                      className={styles.exportUserButton}
                      onClick={() => openUserActionsModal(userAttempt)}
                      title="Acciones de usuario"
                    >
                      <FontAwesomeIcon icon={faEllipsisV}/>
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserActionsModal
          userAttempt={selectedUser}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
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
