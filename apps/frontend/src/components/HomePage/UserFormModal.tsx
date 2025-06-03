import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import { UserData } from "@/types/user";
import { faCakeCandles, faEnvelope, faIdCard, faSave, faShield, faUser, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { InputWithIcon } from "./InputWithIcon";

type  UserFormModalProps = {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: UserData) => void;
};

export function UserFormModal({
  show,
  onHide,
  onSubmit,
}: UserFormModalProps) {
  const [validated, setValidated] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [formData, setFormData] = useState<UserData>({
    name: "",
    id: "",
    email: "",
    age: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);
    onSubmit(formData);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="lg"
      contentClassName={`border-0 rounded-4 shadow ${
        isDarkMode ? "bg-dark" : ""
      }`}
    >
      <div className={styles.header}>
        <h5 className={styles.headerText}>
          <FontAwesomeIcon icon={faUser}/>
          Participant Information
        </h5>

        <button
          className={styles.closeButton}
          onClick={onHide}
        >
          &times;
        </button>
      </div>

      <div className={[
        styles.modalBody,
        isDarkMode ? styles.modalBodyDark : "",
      ].join(" ")}>
        <div
          className={[
            styles.alert,
            isDarkMode ? styles.alertDark : styles.alertLight,
          ].join(" ")}
        >
          <FontAwesomeIcon icon={faShield} className={styles.alertIcon}/>
          Your data will be treated confidentially and used solely for academic purposes.
        </div>

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
                value={formData.age}
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
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />

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
              <FontAwesomeIcon icon={faSave}/>
              Save Information
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
