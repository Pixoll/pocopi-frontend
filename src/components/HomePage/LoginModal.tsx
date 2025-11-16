import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTheme } from "@/hooks/useTheme";
import { useLoginLogic } from "@/hooks/useLoginLogic";
import LoginSection from "./LoginSection";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faWarning, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import type {AssignedTestGroup, TrimmedConfig, Credentials} from "@/api";

type LoginModalProps = {
  config: TrimmedConfig ;
  show: boolean;
  onHide: () => void;
  onCancel?: () => void;
  goToNextPage?: (group: AssignedTestGroup) => void;
  showAnonymousOption?: boolean;
  onAttemptInProgress?: () => void;
  showCancelButton?: boolean;
};

export function LoginModal({
                             config,
                             show,
                             onHide,
                             onCancel,
                             goToNextPage,
                             showAnonymousOption = false,
                             onAttemptInProgress,
                             showCancelButton = true
                           }: LoginModalProps) {
  const { isDarkMode } = useTheme();
  const { saving, error, login, createAnonymousUser } = useLoginLogic({
    config,
    onSuccess: (group) => {
      onHide();
      goToNextPage?.(group);
    },
    onAttemptInProgress: () => {
      onHide();
      onAttemptInProgress?.();
    }
  });

  const [loginData, setLoginData] = useState<Credentials>({ username: "", password: "" });
  const [isCreatingAnonymous, setIsCreatingAnonymous] = useState(false);

  const handleAnonymousLogin = async () => {
    setIsCreatingAnonymous(true);
    await createAnonymousUser();
    setIsCreatingAnonymous(false);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginData);
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      onHide();
    }
  };

  if (isCreatingAnonymous) {
    return (
      <Modal show={show} centered backdrop="static">
        <div className={styles.header}>
          <h5><FontAwesomeIcon icon={faUserSecret} /> Creando usuario anónimo...</h5>
        </div>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleCancelClick} centered backdrop="static">
      <div className={styles.header}>
        <h5><FontAwesomeIcon icon={faUser} /> Iniciar sesión</h5>
      </div>

      <div className={styles.modalBody}>
        {error && (
          <div className={styles.alertError}>
            <FontAwesomeIcon icon={faWarning} /> {error}
          </div>
        )}

        <LoginSection
          config={config}
          username={loginData.username}
          password={loginData.password}
          handleChange={(e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })}
          handleSubmit={handleManualLogin}
          isDarkMode={isDarkMode}
          saving={saving}
          onHide={handleCancelClick}
          showCancelButton={showCancelButton}
          validated
        />

        {showAnonymousOption && config.anonymous && (
          <>
            <div className="text-center my-3">
              <span className="text-muted">o</span>
            </div>

            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={handleAnonymousLogin}
              disabled={saving}
            >
              <FontAwesomeIcon icon={faUserSecret} /> Continuar como usuario anónimo
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
