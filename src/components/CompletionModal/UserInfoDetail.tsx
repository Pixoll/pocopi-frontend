import { useTheme } from "@/hooks/useTheme";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/CompletionModal/UserInfoDetail.module.css";

type UserInfoDetailProps = {
  icon: IconDefinition;
  name: string;
  value: string;
}

export function UserInfoDetail({ icon, name, value }: UserInfoDetailProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={styles.userInfoContainer}>
      <div
        className={[
          styles.iconContainer,
          isDarkMode ? styles.iconContainerDark : styles.iconContainerLight,
        ].join(" ")}
      >
        <FontAwesomeIcon icon={icon}/>
      </div>
      <div className={styles.infoContainer}>
        <span
          className={[
            styles.name,
            isDarkMode ? styles.nameDark : styles.nameLight,
          ].join(" ")}
        >
          {name}
        </span>
        <span className={isDarkMode ? styles.valueDark : ""}>
          {value}
        </span>
      </div>
    </div>
  );
}
