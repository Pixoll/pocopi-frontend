import type {TrimmedConfig, User} from "@/api";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionUserInfo.module.css";
import { faEnvelope, faIdCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserInfoDetail } from "./UserInfoDetail";
import {t} from "@/utils/translations.ts";

type CompletionUserInfoProps = {
  config: TrimmedConfig
  userData: User | null;
}

export function CompletionUserInfo({config, userData }: CompletionUserInfoProps) {
  const { isDarkMode } = useTheme();

  function changeValues(key: keyof User, value: string) {
      if(userData && userData[key]) {
        userData[key] = value;
      }
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
        icon={faIdCard}
        name={t(config, "completion.identification")}
        value={userData ? userData.username : ""}
      />

      <UserInfoDetail
        icon={faEnvelope}
        name={t(config, "completion.email")}
        value={userData?.email ? userData.email : "No hay email e"}
      />
    </div>
  );
}
