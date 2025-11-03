import api, {type AssignedTestGroup, type Credentials, type TrimmedConfig} from "@/api";
import {useTheme} from "@/hooks/useTheme";
import {useAuth} from "@/contexts/AuthContext";
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

type NewUser = {
  username: string;
  name?: string;
  email?: string;
  age?: number;
  password: string;
};

type UserFormModalProps = {
  config: TrimmedConfig;
  show: boolean;
  onHide: () => void;
  goToNextPage: (group: AssignedTestGroup) => void;
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
  const {setToken, generateCredentials, setCredentials} = useAuth();

  const isAnonymous = config.anonymous;

  const [loginData, setLoginData] = useState<Credentials>({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (show && isAnonymous) {
      // para si es anonimo, se crea automaticamente
      handleCreateAnonymousUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, isAnonymous]);

  const handleCreateAnonymousUser = async () => {
    try {
      setSaving(true);
      setError(null);

      const newCredentials = generateCredentials();

      const newUser: NewUser = {
        username: newCredentials.username,
        password: newCredentials.password,
      };

      const registerResponse = await api.register({body: newUser});

      if (registerResponse.data) {
        const loginResponse = await api.login({body: newCredentials});

        if (loginResponse.data) {
          const newToken = loginResponse.data.token;
          setToken(newToken);
          setCredentials(newCredentials);

          const groupResponse = await api.beginTest({auth: newToken});

          if (groupResponse.data) {
            onHide();
            goToNextPage(groupResponse.data.assignedGroup);
          } else if (groupResponse.error) {
            throw new Error(groupResponse.error.message);
          }
        } else if (loginResponse.error) {
          throw new Error(loginResponse.error.message);
        }
      } else if (registerResponse.error) {
        throw new Error(registerResponse.error.message);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isAnonymous) {
    return (
      <Modal
        show={show}
        centered
        backdrop="static"
        size="lg"
        contentClassName={`border-0 rounded-4 shadow ${isDarkMode ? "bg-dark" : ""}`}
      >
        <div className={styles.header}>
          <h5 className={styles.headerText}>
            <FontAwesomeIcon icon={faUser} />
            Creando usuario...
          </h5>
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
            {saving ? "Generando usuario automáticamente..." : "Procesando..."}
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
        </div>
      </Modal>
    );
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
      const response = await api.login({body: loginData});

      if (response.data) {
        const newToken = response.data.token;
        setToken(newToken);

        const userData: Credentials = {
          username: loginData.username,
          password: loginData.password,
        };

        setCredentials(userData);

        const groupResponse = await api.beginTest({auth: newToken});

        if (groupResponse.data) {
          resetForm();
          onHide();
          goToNextPage(groupResponse.data.assignedGroup);
        } else if (groupResponse.error) {
          throw new Error(groupResponse.error.message );
        }
      } else if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
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