import type { TrimmedConfig } from "@/api";
import { InputWithIcon } from "@/components/HomePage/InputWithIcon.tsx";
import { faCircleNotch, faIdCard, faKey, faSignIn, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { t } from "@/utils/translations.ts";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "react-bootstrap";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

type LoginSectionProps = {
  config: TrimmedConfig;
  username: string;
  password: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
  saving: boolean;
  validated: boolean;
}

export default function LoginSection({
  config,
  username,
  password,
  handleChange,
  handleSubmit,
  onCancel,
  isDarkMode,
  saving,
  validated,
}: LoginSectionProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <InputWithIcon
        config={config}
        icon={faIdCard}
        label={"Usuario"}
        name="username"
        value={username}
        onChange={handleChange}
        required
        isDarkMode={isDarkMode}
      />

      <div className={styles.passwordContainer}>
        <InputWithIcon
          config={config}
          icon={faKey}
          label={"Contraseña"}
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleChange}
          required
          isDarkMode={isDarkMode}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={[
            styles.togglePasswordButton,
            isDarkMode ? styles.togglePasswordButtonDark : styles.togglePasswordButtonLight
          ].join(" ")}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
        </button>
      </div>

      <div className={styles.buttonsContainer}>
        <button
          className={[
            styles.button,
            styles.cancelButton,
            isDarkMode ? styles.cancelButtonDark : styles.cancelButtonLight,
          ].join(" ")}
          onClick={onCancel}
          type="button"
        >
          {t(config, "home.cancel")}
        </button>

        <button type="submit" className={[styles.button, styles.saveButton].join(" ")} disabled={saving}>
          <FontAwesomeIcon icon={saving ? faCircleNotch : faSignIn} spin={saving}/>
          {"Iniciar Sesión"}
        </button>
      </div>
    </Form>
  );
}
