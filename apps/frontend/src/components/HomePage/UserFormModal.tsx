import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import { IdentifiableUserData, UserData } from "@/types/user";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { InputWithIcon } from "./InputWithIcon";

type UserFormModalProps = {
  groupLabel: string;
  show: boolean;
  onHide: () => void;
  onSubmit: (data: UserData, onSaved: () => void, onError: (message: string) => void) => void;
};

export function UserFormModal({
  groupLabel,
  show,
  onHide,
  onSubmit,
}: UserFormModalProps) {
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [formData, setFormData] = useState<IdentifiableUserData>({
    anonymous: false,
    id: "",
    group: groupLabel,
    name: "",
    email: "",
    age: 0,
  });

  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? +value : value,
    }));
    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Por favor ingresa un email válido.");
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
    if (!validateEmail(formData.email)) {
      setEmailError("Por favor ingresa un email válido.");
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
      contentClassName={`border-0 rounded-4 shadow ${isDarkMode ? "bg-dark" : ""
        }`}
    >
      <div className={styles.header}>
        <h5 className={styles.headerText}>
          <FontAwesomeIcon icon={faUser} />
          Participant Information
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
          <FontAwesomeIcon icon={faShield} className={styles.alertIcon} />
          Your data will be treated confidentially and used solely for academic purposes.
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
            icon={faUser}
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />

          <div className={styles.inputGroup}>
            <div className={styles.inputGroupMember}>
              <InputWithIcon
                icon={faIdCard}
                label="Identification Number"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                isDarkMode={isDarkMode}
              />
            </div>
            <div className={styles.inputGroupMember}>
              <InputWithIcon
                icon={faCakeCandles}
                label="Age"
                type="number"
                name="age"
                value={formData.age > 0 ? formData.age.toString() : ""}
                onChange={handleChange}
                required
                min="5"
                max="100"
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          <InputWithIcon
            icon={faEnvelope}
            label="Email Address"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
            error={!!emailError}
          />
          {emailError && (
            <div className="text-danger mb-3" style={{ fontSize: "0.95em" }}>
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
              Cancel
            </button>

            <button type="submit" className={[styles.button, styles.saveButton].join(" ")}>
              <FontAwesomeIcon icon={saving ? faCircleNotch : faSave} spin={saving}/>
              Save Information
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
