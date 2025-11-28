import { useState } from 'react';
import api, {
  type FormAnswersByUser,
  type ResultsByUser,
  type TestResultsByUser,
  type UserTestAttemptSummary
} from "@/api";
import { SavePopup } from '@/components/SavePopup';
import styles from '@/styles/DashboardPage/UserActionsModal.module.css';

type UserActionsModalProps = {
  userAttempt: UserTestAttemptSummary;
  isOpen: boolean;
  onClose: () => void;
}

async function getAllDetailByUserId(
  userId: number,
  setError: (error: string | null) => void,
  setSuccess: (success: string | null) => void,
  setData: (data: ResultsByUser) => void
):Promise<void> {
  try {
    const response = await api.getUserResults({ path: { userId } });
    if (response.data) {
      setData(response.data);
      setSuccess("Todos los resultados obtenidos exitosamente");
    }
    if (response.error) {
      setError("Error al obtener todos los resultados");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    setError("Error inesperado al obtener los resultados");
  }
}

async function getFormsDetailByUserId(
  userId: number,
  setError: (error: string | null) => void,
  setSuccess: (success: string | null) => void,
  setData: (data: FormAnswersByUser) => void
):Promise<void> {
  try {
    const response = await api.getUserFormResults({ path: { userId } });
    if (response.data) {
      setData(response.data);
      setSuccess("Resultados de formularios obtenidos exitosamente");
    }
    if (response.error) {
      setError("Error al obtener resultados de formularios");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    setError("Error inesperado al obtener resultados de formularios");
  }
}

async function getTestsDetailByUserId(
  userId: number,
  setError: (error: string | null) => void,
  setSuccess: (success: string | null) => void,
  setData: (data: TestResultsByUser) => void
):Promise<void> {
  try {
    const response = await api.getUserTestResults({ path: { userId } });
    if (response.data) {
      setData(response.data);
      setSuccess("Resultados de tests obtenidos exitosamente");
    }
    if (response.error) {
      setError("Error al obtener resultados de tests");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    setError("Error inesperado al obtener resultados de tests");
  }
}


export default function UserActionsModal({ userAttempt, isOpen, onClose }: UserActionsModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [data, setData] = useState<TestResultsByUser | FormAnswersByUser | null>(null);
  const [savePopupStatus, setSavePopupStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [savePopupMessage, setSavePopupMessage] = useState<string>('');


  const handleGetAllResults = async () => {
    setSavePopupStatus('loading');
    setSavePopupMessage('Obteniendo todos los resultados...');
    await getAllDetailByUserId(userAttempt.user.id, setError, setSuccess, setData);

    if (error) {
      setSavePopupStatus('error');
      setSavePopupMessage(error);
    } else {
      setSavePopupStatus('success');
      setSavePopupMessage('Todos los resultados obtenidos exitosamente');
    }
  };

  const handleGetFormsResults = async () => {
    setSavePopupStatus('loading');
    setSavePopupMessage('Obteniendo resultados de formularios...');
    await getFormsDetailByUserId(userAttempt.user.id, setError, setSuccess, setData);

    if (error) {
      setSavePopupStatus('error');
      setSavePopupMessage(error);
    } else {
      setSavePopupStatus('success');
      setSavePopupMessage('Resultados de formularios obtenidos exitosamente');
    }
  };

  const handleGetTestsResults = async () => {
    setSavePopupStatus('loading');
    setSavePopupMessage('Obteniendo resultados de tests...');
    await getTestsDetailByUserId(userAttempt.user.id, setError, setSuccess, setData);

    if (error) {
      setSavePopupStatus('error');
      setSavePopupMessage(error);
    } else {
      setSavePopupStatus('success');
      setSavePopupMessage('Resultados de tests obtenidos exitosamente');
    }
  };

  const handleClosePopup = () => {
    setSavePopupStatus(null);
    setSavePopupMessage('');
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
              <p><strong>Usuario</strong> {userAttempt.user.name}</p>
              {userAttempt.user.id && (<p><strong>ID:</strong> {userAttempt.user.id}</p>)}
              {userAttempt.user.email && (<p><strong>Email:</strong> {userAttempt.user.email || '-'}</p>)}
              {userAttempt.user.username && (<p><strong>Username:</strong> {userAttempt.user.username}</p>)}
              {userAttempt.user.age && (<p><strong>Age:</strong> {userAttempt.user.age}</p>)}
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
              <button className={styles.actionButton} onClick={handleGetAllResults}>
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
              <button className={styles.actionButton} onClick={handleGetFormsResults}>
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
              <button className={styles.actionButton} onClick={handleGetTestsResults}>
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
