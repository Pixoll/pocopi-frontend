import type {SingleConfigResponse} from "@/api";
import {InputWithIcon} from "@/components/HomePage/InputWithIcon.tsx";
import {faCircleNotch, faIdCard, faKey, faSignIn} from "@fortawesome/free-solid-svg-icons";
import {t} from "@/utils/translations.ts";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Form} from "react-bootstrap";
import type {ChangeEvent, FormEvent} from "react";

type LoginSectionProps = {
  config: SingleConfigResponse;
  username: string;
  password: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onHide: () => void;
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
                                       onHide,
                                       isDarkMode,
                                       saving,
                                       validated
                                     }: LoginSectionProps) {
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

      <InputWithIcon
        config={config}
        icon={faKey}
        label={"Contraseña"}
        type="password"
        name="password"
        value={password}
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
