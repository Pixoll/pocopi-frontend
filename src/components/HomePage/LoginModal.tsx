import { type Credentials, type TrimmedConfig } from "@/api";
import { useLoginLogic } from "@/hooks/useLoginLogic";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import { faUser, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import LoginSection from "./LoginSection";

type LoginModalProps = {
  config: TrimmedConfig;
  show: boolean;
  onSuccess: () => void;
  onCancel: () => void;
};

export function LoginModal({
  config,
  show,
  onSuccess,
  onCancel,
}: LoginModalProps) {
  const { isDarkMode } = useTheme();
  const { saving, error, login } = useLoginLogic();

  const [loginData, setLoginData] = useState<Credentials>({ username: "", password: "" });

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await login(loginData)) {
      onSuccess();
    }
  };

  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static">
      <div className={styles.header}>
        <h5><FontAwesomeIcon icon={faUser}/> Iniciar sesión</h5>
      </div>

      <div className={styles.modalBody}>
        {error && (
          <div className={styles.alertError}>
            <FontAwesomeIcon icon={faWarning}/> {error}
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
          onCancel={onCancel}
          validated
        />
      </div>
    </Modal>
  );
}
