import type { User } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/CompletionModal/CompletionUserInfo.module.css";
import { faEnvelope, faIdCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { config } from "@pocopi/config";
import { UserInfoDetail } from "./UserInfoDetail";

type CompletionUserInfoProps = {
  userData: Extract<User, { anonymous: false }>;
}

export function CompletionUserInfo({ userData }: CompletionUserInfoProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={[
        styles.container,
        isDarkMode ? styles.containerDark : styles.containerLight,
      ].join(" ")}
    >
      <div className={styles.title}>
        {config.t("completion.userInfo")}
      </div>

      <UserInfoDetail
        icon={faUser}
        name={config.t("completion.name")}
        value={userData.name}
      />

      <UserInfoDetail
        icon={faIdCard}
        name={config.t("completion.identification")}
        value={userData.id}
      />

      <UserInfoDetail
        icon={faEnvelope}
        name={config.t("completion.email")}
        value={userData.email}
      />
    </div>
  );
}
