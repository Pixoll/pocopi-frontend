import type {CreateUserRequest, Group, SingleConfigResponse} from "@/api";
import {useTheme} from "@/hooks/useTheme";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import {
  faCakeCandles,
  faCircleNotch,
  faEnvelope,
  faIdCard,
  faSave,
  faShield,
  faUser,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {type ChangeEvent, type FormEvent, useState} from "react";
import {Form, Modal} from "react-bootstrap";
import {InputWithIcon} from "./InputWithIcon";
import {t} from "@/utils/translations.ts";

type UserFormModalProps = {
  config: SingleConfigResponse;
  group: Group;
  show: boolean;
  onHide: () => void;
  onSubmit: (data: CreateUserRequest, onSaved: () => void, onError: (message: string) => void) => void;
};

export function UserFormModal({
                                config,
                                group,
                                show,
                                onHide,
                                onSubmit,
                              }: UserFormModalProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value, type} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? +value : value,
    }));
    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError(t(config, "home.pleaseEnterValid", "email"));
      } else {
        setEmailError(null);
      }
    }
  };

  const onSaved = () => {
    setSaving(false);
  };

  const onSavedError = (message: string) => {
    setSaving(false);
    setError(message);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    let valid = true;
    if (!validateEmail(formData.email || "")) {
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
    onSubmit(formData, onSaved, onSavedError);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="lg"
      contentClassName={`border-0 rounded-4 shadow ${isDarkMode ? "bg-dark" : ""}`}
    >
      <div className={styles.header}>
        <h5 className={styles.headerText}>
          <FontAwesomeIcon icon={faUser}/>
          {t(config, "home.participantInformation")}
        </h5>

        <button
          className={styles.closeButton}
          onClick={onHide}
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
          {t(config, "home.registrationModalMessage")}
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

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <InputWithIcon
            config={config}
            icon={faUser}
            label={t(config, "home.fullName")}
            name="name"
            value={formData.name ?? ""}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />

          <div className={styles.inputGroup}>
            <div className={styles.inputGroupMember}>
              <InputWithIcon
                config={config}
                icon={faIdCard}
                label={t(config, "home.identificationNumber")}
                name="id"
                value={formData.username ?? ""}
                onChange={handleChange}
                required
                isDarkMode={isDarkMode}
              />
            </div>
            <div className={styles.inputGroupMember}>
              <InputWithIcon
                config={config}
                icon={faCakeCandles}
                label={t(config, "home.age")}
                type="number"
                name="age"
                value={(formData.age) && formData.age > 0 ? formData.age.toString() : ""}
                onChange={handleChange}
                required
                min="5"
                max="100"
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          <InputWithIcon
            config={config}
            icon={faEnvelope}
            label={t(config, "home.email")}
            type="text"
            name="email"
            value={formData.email ?? ""}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
            error={!!emailError}
          />
          {emailError && (
            <div className="text-danger mb-3" style={{fontSize: "0.95em"}}>
              {emailError}
            </div>
          )}

          <div className={styles.buttonsContainer}>
            <button
              className={[
                styles.button,
                styles.cancelButton,
                isDarkMode ? styles.cancelButtonDark : styles.cancelButtonLight,
              ].join(" ")}
              onClick={onHide}
            >
              {t(config, "home.cancel")}
            </button>

            <button type="submit" className={[styles.button, styles.saveButton].join(" ")}>
              <FontAwesomeIcon icon={saving ? faCircleNotch : faSave} spin={saving}/>
              {t(config, "home.saveInformation")}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
