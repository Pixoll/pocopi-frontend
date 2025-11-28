import api, { type UserTestAttemptSummary } from "@/api";
import { SavePopup } from "@/components/SavePopup";
import styles from "@/styles/DashboardPage/UserActionsModal.module.css";
import { useState } from "react";

type UserActionsModalProps = {
  userAttempt: UserTestAttemptSummary;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserActionsModal({ userAttempt, isOpen, onClose }: UserActionsModalProps) {
  const [savePopupStatus, setSavePopupStatus] = useState<"loading" | "success" | "error" | null>(null);
  const [savePopupMessage, setSavePopupMessage] = useState<string>("");

  const downloadResults = async () => {
    setSavePopupStatus("loading");
    setSavePopupMessage("Obteniendo todos los resultados...");

    const result = await api.getUserResults({ path: { userId: userAttempt.user.id } });

    if (!result.data) {
      setSavePopupStatus("error");
      setSavePopupMessage("Error al obtener todos los resultados");
    } else {
      setSavePopupStatus("success");
      setSavePopupMessage("Todos los resultados obtenidos exitosamente");

      downloadJson(result.data, "results.json");
    }
  };

  const downloadFormResults = async () => {
    setSavePopupStatus("loading");
    setSavePopupMessage("Obteniendo resultados de formularios...");

    const result = await api.getUserFormResults({ path: { userId: userAttempt.user.id } });

    if (!result.data) {
      setSavePopupStatus("error");
      setSavePopupMessage("Error al obtener resultados de formularios");
    } else {
      setSavePopupStatus("success");
      setSavePopupMessage("Resultados de formularios obtenidos exitosamente");

      downloadJson(result.data, "form-results.json");
    }
  };

  const downloadTestResults = async () => {
    setSavePopupStatus("loading");
    setSavePopupMessage("Obteniendo resultados de tests...");

    const result = await api.getUserTestResults({ path: { userId: userAttempt.user.id } });

    if (!result.data) {
      setSavePopupStatus("error");
      setSavePopupMessage("Error al obtener resultados de tests");
    } else {
      setSavePopupStatus("success");
      setSavePopupMessage("Resultados de tests obtenidos exitosamente");

      downloadJson(result.data, "test-results.json");
    }
  };

  const handleClosePopup = () => {
    setSavePopupStatus(null);
    setSavePopupMessage("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Acciones de Usuario</h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.userInfo}>
              <p><strong>Usuario</strong>
                {userAttempt.user.name}</p>
              {userAttempt.user.id && (<p>
                <strong>ID:</strong>
                {userAttempt.user.id}</p>)}
              {userAttempt.user.email && (<p>
                <strong>Email:</strong>
                {userAttempt.user.email || "-"}</p>)}
              {userAttempt.user.username && (<p>
                <strong>Username:</strong>
                {userAttempt.user.username}</p>)}
              {userAttempt.user.age && (<p>
                <strong>Age:</strong>
                {userAttempt.user.age}</p>)}
            </div>

            <div className={styles.actionItem}>
              <div className={styles.actionInfo}>
                <h3>Obtener Todos los Resultados</h3>
                <p className={styles.actionDescription}>
                  Recupera todos los resultados disponibles del usuario en el sistema.
                </p>
                <p className={styles.actionNote}>
                  <strong>Por si acaso:</strong> Esto incluye resultados de tests, formularios de todas las configuraciones asociadas
                </p>
              </div>
              <button className={styles.actionButton} onClick={downloadResults}>
                Obtener Todos
              </button>
            </div>

            <div className={styles.actionItem}>
              <div className={styles.actionInfo}>
                <h3>Obtener Resultados de Formularios</h3>
                <p className={styles.actionDescription}>
                  Recupera únicamente los resultados de formularios completados por el usuario.
                </p>
                <p className={styles.actionNote}>
                  <strong>Por si acaso:</strong> Solo incluye formularios de todas las configuraciones asociadas, excluyendo tests.
                </p>
              </div>
              <button className={styles.actionButton} onClick={downloadFormResults}>
                Obtener Formularios
              </button>
            </div>

            <div className={styles.actionItem}>
              <div className={styles.actionInfo}>
                <h3>Obtener Resultados de Tests</h3>
                <p className={styles.actionDescription}>
                  Recupera únicamente los resultados de tests realizados por el usuario.
                </p>
                <p className={styles.actionNote}>
                  <strong>Por si acaso:</strong> Solo incluye tests de todas las configuraciones asociadas, excluyendo resultados de formularios.
                </p>
              </div>
              <button className={styles.actionButton} onClick={downloadTestResults}>
                Obtener Tests
              </button>
            </div>
          </div>
        </div>
      </div>

      <SavePopup
        status={savePopupStatus}
        message={savePopupMessage}
        onClose={handleClosePopup}
      />
    </>
  );
}

function downloadJson(json: object, filename: string): void {
  const file = new Blob([JSON.stringify(json)], { type: "application/json" });
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  link.click();

  URL.revokeObjectURL(url);
}

