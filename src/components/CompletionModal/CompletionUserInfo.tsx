import api, {type CredentialsUpdate, type TrimmedConfig, type User, type ApiHttpError} from "@/api";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionUserInfo.module.css";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserInfoDetail } from "./UserInfoDetail";
import { InputWithIcon } from "@/components/HomePage/InputWithIcon";
import {t} from "@/utils/translations.ts";
import { useState } from "react";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { SavePopup } from "@/components/SavePopup";
import {useAuth} from "@/contexts/AuthContext.tsx";


async function updateCredentials(data: CredentialsUpdate): Promise<void> {
  try {
    await api.updateCredentials({body: data});
  } catch (e) {
    console.error(e);
    throw e;
  }
}

type CompletionUserInfoProps = {
  config: TrimmedConfig
  userData: User | null;
  isAdmin: boolean;
}

export function CompletionUserInfo({config, userData, isAdmin }: CompletionUserInfoProps) {
  const { isDarkMode } = useTheme();
  const { credentials, hasUpdatedAnonymousCredentials, markAnonymousCredentialsUpdated, isLoggedIn } = useAuth()

  const [credentialsUpdate, setCredentialsUpdate] = useState<CredentialsUpdate>({
    oldUsername: credentials?.username || "",
    newUsername: "",
    oldPassword: credentials?.password || "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [error, setError] = useState<string | ApiHttpError | null>(null);
  const [saveStatus, setSaveStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  const handleFieldChange = (field: keyof CredentialsUpdate, value: string) => {
    setCredentialsUpdate(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (credentialsUpdate.newPassword !== credentialsUpdate.confirmNewPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (credentialsUpdate.newPassword && credentialsUpdate.newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!credentialsUpdate.oldPassword) {
      setError("Debes ingresar tu contraseña actual para realizar cambios");
      return;
    }

    if (!credentialsUpdate.newUsername) {
      setError("Debes ingresar un nuevo nombre de usuario");
      return;
    }

    setSaveStatus('loading');
    setError(null);

    try {
      await updateCredentials(credentialsUpdate);
      markAnonymousCredentialsUpdated();

      setSaveStatus('success');
      setCredentialsUpdate(prev => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        oldUsername: prev.newUsername
      }));

    } catch (e) {
      setSaveStatus('error');
      setError(e as ApiHttpError);
    }
  };

  const handleCloseSavePopup = () => {
    setSaveStatus(null);
  };


  if (!config.anonymous) {
    return null;
  }

  return (
    <>
      <div
        className={[
          styles.container,
          isDarkMode ? styles.containerDark : styles.containerLight,
        ].join(" ")}
      >
        <div className={styles.title}>
          {t(config, "completion.userInfo")}
        </div>

        {userData?.name && (
          <UserInfoDetail
            icon={faUser}
            name={t(config, "completion.name")}
            value={userData.name}
          />
        )}

        {userData?.email && (
          <UserInfoDetail
            icon={faEnvelope}
            name={t(config, "completion.email")}
            value={userData.email}
          />
        )}

        {!isAdmin && config.anonymous && credentials && isLoggedIn && !hasUpdatedAnonymousCredentials && (
          <>
            <div className={styles.separator}>
              <span>Actualizar credenciales</span>
            </div>

            {hasUpdatedAnonymousCredentials ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Cuenta creada correctamente</h3>
                <p>Tus credenciales han sido actualizadas exitosamente. Ahora tu cuenta es permanente.</p>
              </div>
            ) : (
              <>
                <InputWithIcon
                  config={config}
                  icon={faUser}
                  label="Nuevo usuario"
                  name="newUsername"
                  type="text"
                  value={credentialsUpdate.newUsername}
                  onChange={(e) => handleFieldChange('newUsername', e.target.value)}
                  isDarkMode={isDarkMode}
                  required={false}
                />

                <InputWithIcon
                  config={config}
                  icon={faLock}
                  label="Nueva contraseña"
                  name="newPassword"
                  type="password"
                  value={credentialsUpdate.newPassword}
                  onChange={(e) => handleFieldChange('newPassword', e.target.value)}
                  isDarkMode={isDarkMode}
                  required={false}
                />

                <InputWithIcon
                  config={config}
                  icon={faLock}
                  label="Confirmar nueva contraseña"
                  name="confirmNewPassword"
                  type="password"
                  value={credentialsUpdate.confirmNewPassword}
                  onChange={(e) => handleFieldChange('confirmNewPassword', e.target.value)}
                  isDarkMode={isDarkMode}
                  required={false}
                />

                <button
                  onClick={handleSubmit}
                  className={styles.updateButton}
                  disabled={saveStatus === 'loading'}
                >
                  {saveStatus === 'loading' ? 'Actualizando...' : 'Crear cuenta permanente'}
                </button>
              </>
            )}
          </>
        )}
      </div>

      {!isAdmin && (
        <>
          <SavePopup
            status={saveStatus}
            message={
              saveStatus === 'success'
                ? 'Credenciales actualizadas correctamente'
                : saveStatus === 'error'
                  ? 'Error al actualizar las credenciales'
                  : undefined
            }
            onClose={handleCloseSavePopup}
          />

          {error && (
            <ErrorDisplay
              error={error}
              onClose={() => setError(null)}
            />
          )}
        </>
      )}
    </>
  );
}
