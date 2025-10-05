import type {CreateUserRequest, Group, SingleConfigResponse} from "@/api";
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
  group: Group;
  show: boolean;
  onHide: () => void;
  onRegister?: (data: CreateUserRequest, onSaved: () => void, onError: (message: string) => void) => void;
  onLogin?: (username: string, password: string, onSuccess: () => void, onError: (message: string) => void) => void;
};

type ViewMode = "initial" | "register" | "login" | "anonymous-choice";

export function UserFormModal({
                                config,
                                group,
                                show,
                                onHide,
                                //onRegister,
                                //onLogin,
                              }: UserFormModalProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("initial");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const {isDarkMode} = useTheme();

  const [formData, setFormData] = useState<CreateUserRequest>({
    anonymous: false,
    username: "",
    groupId: group.id,
    name: "",
    email: "",
    age: 0,
    password: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value, type} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? +value : value,
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

  /*const onSaved = () => {
    setSaving(false);
    resetForm();
    onHide();
  };

  const onSavedError = (message: string) => {
    setSaving(false);
    setError(message);
  };*/

  const handleRegisterSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    /*const dataToSubmit = {
      ...formData,
      anonymous: isAnonymous,
    };*/

    //onRegister(dataToSubmit, onSaved, onSavedError);
  };

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
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
    //onLogin(loginData.username, loginData.password, onSaved, onSavedError);
  };

  const resetForm = () => {
    setFormData({
      anonymous: false,
      username: "",
      groupId: group.id,
      name: "",
      email: "",
      age: 0,
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
    setIsAnonymous(false);
  };

  const handleAnonymousChoice = (anonymous: boolean) => {
    setIsAnonymous(anonymous);
    setFormData(prev => ({...prev, anonymous}));
    setViewMode("register");
  };

  const getModalTitle = () => {
    switch (viewMode) {
      case "login":
        return "Iniciar sesión";
      case "register":
      case "anonymous-choice":
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
          <FontAwesomeIcon icon={faUser}/>
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
          <FontAwesomeIcon icon={faShield} className={styles.alertIcon}/>
          {viewMode === "login"
            ? "Inicia sesión con tu usuario y contraseña"
            : ""}
        </div>

        {error && (
          <div
            className={[
              styles.alert,
              isDarkMode ? styles.alertErrorDark : styles.alertErrorLight,
            ].join(" ")}
          >
            <FontAwesomeIcon icon={faWarning} className={styles.alertIcon}/>
            {error}
          </div>
        )}

        {viewMode === "initial" && (
          <div className={styles.buttonsContainer} style={{flexDirection: "column", gap: "1rem"}}>
            <button
              className={[styles.button, styles.saveButton].join(" ")}
              onClick={() => setViewMode("anonymous-choice")}
              style={{width: "100%"}}
            >
              <FontAwesomeIcon icon={faUserPlus}/>
              {t(config, "home.register", "Registrarse")}
            </button>
            <button
              className={[styles.button, styles.saveButton].join(" ")}
              onClick={() => setViewMode("login")}
              style={{width: "100%"}}
            >
              <FontAwesomeIcon icon={faSignIn}/>
              {"Iniciar Sesión"}
            </button>
          </div>
        )}

        {viewMode === "anonymous-choice" && (
          <div className={styles.buttonsContainer} style={{flexDirection: "column", gap: "1rem"}}>
            <p style={{textAlign: "center", marginBottom: "1rem"}}>
              {"¿Deseas registrarte de forma anónima?"}
            </p>
            <button
              className={[styles.button, styles.saveButton].join(" ")}
              onClick={() => handleAnonymousChoice(true)}
              style={{width: "100%"}}
            >
              {"Sí, usuario anónimo"}
            </button>
            <button
              className={[styles.button, styles.saveButton].join(" ")}
              onClick={() => handleAnonymousChoice(false)}
              style={{width: "100%"}}
            >
              {"No, con datos completos"}
            </button>
            <button
              className={[
                styles.button,
                styles.cancelButton,
                isDarkMode ? styles.cancelButtonDark : styles.cancelButtonLight,
              ].join(" ")}
              onClick={() => setViewMode("initial")}
              style={{width: "100%"}}
            >
              {"Volver"}
            </button>
          </div>
        )}

        {viewMode === "register" && (
          <RegisterSection
            config={config}
            userData={formData}
            handleChange={handleRegisterChange}
            handleSubmit={handleRegisterSubmit}
            onHide={() => setViewMode("anonymous-choice")}
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