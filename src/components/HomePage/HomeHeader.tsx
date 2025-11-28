import type { TrimmedConfig, UserTestAttempt } from "@/api";
import { LoginButton } from "@/components/LoginButton";
import styles from "@/styles/HomePage/HomeHeader.module.css";

type HomeHeaderProps = {
  config: TrimmedConfig;
  isDarkMode: boolean;
  goToNextPage?: (attempt: UserTestAttempt) => void;
  onAttemptInProgress?: () => void;
  onLoginSuccess?: () => void;
};

export function HomeHeader({
                             config,
                             isDarkMode,
                             onAttemptInProgress,
                             onLoginSuccess
                           }: HomeHeaderProps) {
  return (
    <div className={styles.header}>
      <div
        className={[
          styles.iconWrapper,
          isDarkMode ? styles.iconDark : styles.iconLight,
        ].join(" ")}
      >
        {config.icon && (
          <img className={styles.appIcon} src={config.icon.url} alt={config.icon.alt}/>
        )}
      </div>

      <h1 className={styles.title}>{config.title}</h1>

      <div className="flex items-center gap-2">
        {config.subtitle && <div className={styles.subtitle}>{config.subtitle}</div>}

        {config.anonymous && (
          <LoginButton
            config={config}
            variant="icon"
            onAttemptInProgress={onAttemptInProgress}
            onLoginSuccess={onLoginSuccess}
            stayOnPage={true}
          />
        )}
      </div>
    </div>
  );
}
