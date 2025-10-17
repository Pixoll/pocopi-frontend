import api, {type NewUser, type Credentials, type SingleConfigResponse} from "@/api";
import {useTheme} from "@/hooks/useTheme";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import {
  faShield,
  faUser,
  faUserPlus,
  faSignIn,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {type ChangeEvent, type FormEvent, useState} from "react";
import {Modal} from "react-bootstrap";
import {t} from "@/utils/translations.ts";
import RegisterSection from "./RegisterSection";
import LoginSection from "./LoginSection";

type UserFormModalProps = {
  config: SingleConfigResponse;
  show: boolean;
  onHide: () => void;
  goToNextPage: (data: NewUser) => void;
};
type ViewMode = "initial" | "register" | "login";

export function UserFormModal({
                                config,
                                show,
                                onHide,
                                goToNextPage,
                              }: UserFormModalProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("initial");
  const {isDarkMode} = useTheme();

  const isAnonymous = config.anonymous ?? false;

  const [formData, setFormData] = useState<NewUser>({
    anonymous: isAnonymous,
    username: "",
    name: "",
    email: "",
    age: "0",
    password: "",
  });

  const [loginData, setLoginData] = useState<Credentials>({
    username: "",
    password: "",
  });

  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email" && !isAnonymous) {
      if (!validateEmail(value)) {
        setEmailError(t(config, "home.pleaseEnterValid", "email"));
      } else {
        setEmailError(null);
      }
    }
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    let valid = true;

    if (!isAnonymous && !validateEmail(formData.email || "")) {
      setEmailError(t(config, "home.pleaseEnterValid", "email"));
      valid = false;
    } else {
      setEmailError(null);
    }

    if (!form.checkValidity() || !valid) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setSaving(true);

    const dataToSubmit: NewUser = {
      username: formData.username,
      password: formData.password,
      anonymous: isAnonymous,
      name: isAnonymous ? "" : formData.name,
      email: isAnonymous ? "" : formData.email,
      age: isAnonymous ? "0" : formData.age,
    };

    try {
      await api.register({body:dataToSubmit});

      setSaving(false);
      resetForm();
      onHide();
      goToNextPage(dataToSubmit);
    } catch (err: any) {
      setSaving(false);
      setError(err.message || "Error al registrar usuario");
    }
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
      await api.login({body:loginData});

      setSaving(false);
      resetForm();
      onHide();
    } catch (err: any) {
      setSaving(false);
      setError(err.message || "Error al iniciar sesión");
    }
  };

  const resetForm = () => {
    setFormData({
      anonymous: isAnonymous,
      username: "",
      name: "",
      email: "",
      age: "0",
      password: "",
    });
    setLoginData({
      username: "",
      password: "",
    });
    setValidated(false);
    setError(null);
    setEmailError(null);
    setViewMode("initial");
  };

  const getModalTitle = () => {
    switch (viewMode) {
      case "login":
        return "Iniciar sesión";
      case "register":
        return t(config, "home.register", "Registrarse");
      default:
        return t(config, "home.participantInformation");
    }
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
          {getModalTitle()}
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
          {viewMode === "login"
            ? "Inicia sesión con tu usuario y contraseña"
            : isAnonymous
              ? "Registro anónimo: solo necesitas usuario y contraseña"
              : "Registro con datos completos"}
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

        {viewMode === "initial" && (
          <div
            className={styles.buttonsContainer}
            style={{flexDirection: "column", gap: "1rem"}}
          >
            <button
              className={[styles.button, styles.saveButton].join(" ")}
              onClick={() => setViewMode("register")}
              style={{width: "100%"}}
            >
              <FontAwesomeIcon icon={faUserPlus} />
              {t(config, "home.register", "Registrarse")}
            </button>
            <button
              className={[styles.button, styles.saveButton].join(" ")}
              onClick={() => setViewMode("login")}
              style={{width: "100%"}}
            >
              <FontAwesomeIcon icon={faSignIn} />
              {"Iniciar Sesión"}
            </button>
          </div>
        )}

        {viewMode === "register" && (
          <RegisterSection
            config={config}
            userData={formData}
            handleChange={handleRegisterChange}
            handleSubmit={handleRegisterSubmit}
            onHide={() => setViewMode("initial")}
            isDarkMode={isDarkMode}
            saving={saving}
            validated={validated}
            emailError={emailError}
            isAnonymous={isAnonymous}
          />
        )}

        {viewMode === "login" && (
          <LoginSection
            config={config}
            username={loginData.username}
            password={loginData.password}
            handleChange={handleLoginChange}
            handleSubmit={handleLoginSubmit}
            onHide={() => setViewMode("initial")}
            isDarkMode={isDarkMode}
            saving={saving}
            validated={validated}
          />
        )}
      </div>
    </Modal>
  );
}