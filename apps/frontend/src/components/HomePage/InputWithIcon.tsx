import styles from "@/styles/HomePage/InputWithIcon.module.css";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent } from "react";
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
}: InputWithIconProps) {
  const invalidText = name === "id"
    ? "your identification number"
    : name === "email"
      ? "a valid email address"
      : `a valid ${name.toLowerCase()}`;

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
          ].join(" ")}
          type={type}
          placeholder={`Enter your ${name.toLowerCase()}`}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
        />

        <FontAwesomeIcon
          className={[
            styles.icon,
            isDarkMode ? styles.iconDark : styles.iconLight,
          ].join(" ")}
          icon={icon}
        />

        <Form.Control.Feedback type="invalid">
          Please enter {invalidText}.
        </Form.Control.Feedback>
      </FloatingLabel>
    </div>
  );
}
