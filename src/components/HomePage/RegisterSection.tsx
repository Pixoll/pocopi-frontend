import type {NewUser, SingleConfigResponse} from "@/api";
import {InputWithIcon} from "@/components/HomePage/InputWithIcon.tsx";
import {faCakeCandles, faCircleNotch, faEnvelope, faIdCard, faKey, faSave, faUser} from "@fortawesome/free-solid-svg-icons";
import {t} from "@/utils/translations.ts";
import styles from "@/styles/HomePage/UserFormModal.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Form} from "react-bootstrap";
import type {ChangeEvent, FormEvent} from "react";

type RegisterSectionProps = {
  config: SingleConfigResponse;
  userData: NewUser;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onHide: () => void;
  isDarkMode: boolean;
  saving: boolean;
  validated: boolean;
  emailError: string | null;
  isAnonymous: boolean;
}

export default function RegisterSection({
                                          config,
                                          userData,
                                          handleChange,
                                          handleSubmit,
                                          onHide,
                                          isDarkMode,
                                          saving,
                                          validated,
                                          emailError,
                                          isAnonymous
                                        }: RegisterSectionProps) {
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <InputWithIcon
        config={config}
        icon={faIdCard}
        label={"Usuario"}
        name="username"
        value={userData.username ?? ""}
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
        value={userData.password ?? ""}
        onChange={handleChange}
        required
        isDarkMode={isDarkMode}
      />

      {!isAnonymous && (
        <>
          <InputWithIcon
            config={config}
            icon={faUser}
            label={t(config, "home.fullName")}
            name="name"
            value={userData.name ?? ""}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />

          <div className={styles.inputGroup}>
            <div className={styles.inputGroupMember}>
              <InputWithIcon
                config={config}
                icon={faCakeCandles}
                label={t(config, "home.age")}
                type="number"
                name="age"
                value={userData.age && userData.age !== "0" ? userData.age : ""}
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
            value={userData.email ?? ""}
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
        </>
      )}

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
          <FontAwesomeIcon icon={saving ? faCircleNotch : faSave} spin={saving}/>
          {t(config, "home.register", "Registrarse")}
        </button>
      </div>
    </Form>
  );
}
