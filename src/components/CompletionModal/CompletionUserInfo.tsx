import type {NewUser, Config} from "@/api";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionUserInfo.module.css";
import { faEnvelope, faIdCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserInfoDetail } from "./UserInfoDetail";
import {t} from "@/utils/translations.ts";

type CompletionUserInfoProps = {
  config: Config
  userData: NewUser;
}

export function CompletionUserInfo({config, userData }: CompletionUserInfoProps) {
  const { isDarkMode } = useTheme();

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
        value={userData.name}
      />

      <UserInfoDetail
        icon={faIdCard}
        name={t(config, "completion.identification")}
        value={userData.username}
      />

      <UserInfoDetail
        icon={faEnvelope}
        name={t(config, "completion.email")}
        value={userData.email}
      />
    </div>
  );
}
