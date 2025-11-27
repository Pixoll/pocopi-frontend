import styles from "@/styles/HomePage/InputWithIcon.module.css";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ChangeEvent } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import {t} from "@/utils/translations.ts";
import type {TrimmedConfig} from "@/api";

type InputWithIconProps = {
  config: TrimmedConfig;
  icon: IconDefinition;
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
  isDarkMode: boolean;
  error?: boolean;
  disabled?: boolean;
};

export function InputWithIcon({
                                config,
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
                                error = false,
                                disabled = false,
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
            disabled ? styles.inputDisabled : "",
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
          disabled={disabled}
        />
        <FontAwesomeIcon
          className={[
            styles.icon,
            isDarkMode ? styles.iconDark : styles.iconLight,
            error ? styles.iconError : "",
            disabled ? styles.iconDisabled : "",
          ].join(" ")}
          icon={icon}
        />
        {error && name !== "email" && (
          <Form.Control.Feedback type="invalid">
            {t(config, "home.pleaseEnterValid", label.toLowerCase())}
          </Form.Control.Feedback>
        )}
      </FloatingLabel>
    </div>
  );
}
