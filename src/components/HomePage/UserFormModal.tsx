import api, {type Credentials, type Config} from "@/api";
import {useTheme} from "@/hooks/useTheme";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import {
  faShield,
  faUser,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {type ChangeEvent, type FormEvent, useState, useEffect} from "react";
import {Modal} from "react-bootstrap";
import LoginSection from "./LoginSection";

type UserFormModalProps = {
  config: Config;
  show: boolean;
  onHide: () => void;
  goToNextPage: (data: Credentials) => void;
};

export function UserFormModal({
                                config,
                                show,
                                onHide,
                                goToNextPage,
                              }: UserFormModalProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {isDarkMode} = useTheme();

  const isAnonymous = config.anonymous;

  const [loginData, setLoginData] = useState<Credentials>({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (show && isAnonymous) {
      const anonymousUser: { username: string; password: string } = {
        username: "anonymous",
        password: "anonymous",
      };

      goToNextPage(anonymousUser);
      onHide();
    }
  }, [show, isAnonymous, goToNextPage, onHide]);

  if (isAnonymous) {
    return null;
  }

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setSaving(true);

    try {
      await api.login({body: loginData});

      const userData: { username: string; password: string } = {
        username: loginData.username,
        password: loginData.password,
      };

      setSaving(false);
      resetForm();
      onHide();
      goToNextPage(userData);
    } catch (err: any) {
      setSaving(false);
      setError(err.message || "Error al iniciar sesión");
    }
  };

  const resetForm = () => {
    setLoginData({
      username: "",
      password: "",
    });
    setValidated(false);
    setError(null);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm();
        onHide();
      }}
      centered
      backdrop="static"
      size="lg"
      contentClassName={`border-0 rounded-4 shadow ${isDarkMode ? "bg-dark" : ""}`}
    >
      <div className={styles.header}>
        <h5 className={styles.headerText}>
          <FontAwesomeIcon icon={faUser} />
          Iniciar sesión
        </h5>

        <button
          className={styles.closeButton}
          onClick={() => {
            resetForm();
            onHide();
          }}
        >
          &times;
        </button>
      </div>

      <div
        className={[
          styles.modalBody,
          isDarkMode ? styles.modalBodyDark : "",
        ].join(" ")}
      >
        <div
          className={[
            styles.alert,
            isDarkMode ? styles.alertDataDark : styles.alertDataLight,
          ].join(" ")}
        >
          <FontAwesomeIcon icon={faShield} className={styles.alertIcon} />
          Inicia sesión con tu usuario y contraseña
        </div>

        {error && (
          <div
            className={[
              styles.alert,
              isDarkMode ? styles.alertErrorDark : styles.alertErrorLight,
            ].join(" ")}
          >
            <FontAwesomeIcon icon={faWarning} className={styles.alertIcon} />
            {error}
          </div>
        )}

        <LoginSection
          config={config}
          username={loginData.username}
          password={loginData.password}
          handleChange={handleLoginChange}
          handleSubmit={handleLoginSubmit}
          onHide={onHide}
          isDarkMode={isDarkMode}
          saving={saving}
          validated={validated}
        />
      </div>
    </Modal>
  );
}