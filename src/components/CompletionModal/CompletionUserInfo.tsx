import type {TrimmedConfig, User} from "@/api";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionUserInfo.module.css";
import { faEnvelope, faIdCard, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserInfoDetail } from "./UserInfoDetail";
import { InputWithIcon } from "@/components/HomePage/InputWithIcon";
import {t} from "@/utils/translations.ts";
import { useState } from "react";

type CompletionUserInfoProps = {
  config: TrimmedConfig
  userData: User | null;
  onUserDataChange?: (field: 'username' | 'password', value: string) => void;
}

export function CompletionUserInfo({config, userData, onUserDataChange }: CompletionUserInfoProps) {
  const { isDarkMode } = useTheme();
  const [username, setUsername] = useState(userData?.username || "");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (onUserDataChange) {
      onUserDataChange('username', newUsername);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (onUserDataChange) {
      onUserDataChange('password', newPassword);
    }
  };

  if (!config.anonymous) {
    return null;
  }

  return (
    <div
      className={[
        styles.container,
        isDarkMode ? styles.containerDark : styles.containerLight,
      ].join(" ")}
    >
      <div className={styles.title}>
        {t(config, "completion.userInfo")}
      </div>

      <UserInfoDetail
        icon={faUser}
        name={t(config, "completion.name")}
        value={userData?.name ? userData.name : ""}
      />

      <UserInfoDetail
        icon={faEnvelope}
        name={t(config, "completion.email")}
        value={userData?.email ? userData.email : ""}
      />

      <InputWithIcon
        config={config}
        icon={faIdCard}
        label={t(config, "completion.identification")}
        name="username"
        type="text"
        value={username}
        onChange={handleUsernameChange}
        isDarkMode={isDarkMode}
        required={false}
      />



      <InputWithIcon
        config={config}
        icon={faLock}
        label={"Contraseña..."}
        name="password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        isDarkMode={isDarkMode}
        required={false}
      />
    </div>
  );
}