import styles from "@/styles/HomePage/InputWithIcon.module.css";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import type { ChangeEvent } from "react";
import { FloatingLabel, Form } from "react-bootstrap";

type InputWithIconProps = {
  icon: IconDefinition;
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
  isDarkMode: boolean;
  error?: boolean; // Nuevo prop para indicar error
};

export function InputWithIcon({
  icon,
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  min,
  max,
  isDarkMode,
  error = false, // Nuevo prop con valor por defecto
}: InputWithIconProps) {
  return (
    <div className={styles.inputContainer}>
      <FloatingLabel
        controlId={`form${name}`}
        label={<span style={{ paddingLeft: "1.75rem" }}>{label}</span>}
      >
        <Form.Control
          className={[
            styles.input,
            isDarkMode ? styles.inputDark : "",
            error ? styles.inputError : "",
          ].join(" ")}
          type={type}
          placeholder={`Enter your ${name.toLowerCase()}`}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          isInvalid={error}
        />
        <FontAwesomeIcon
          className={[
            styles.icon,
            isDarkMode ? styles.iconDark : styles.iconLight,
            error ? styles.iconError : "",
          ].join(" ")}
          icon={icon}
        />
        {error && name !== "email" && (
          <Form.Control.Feedback type="invalid">
              {config.t("home.pleaseEnterValid", label.toLowerCase())}
          </Form.Control.Feedback>
        )}
      </FloatingLabel>
    </div>
  );
}
