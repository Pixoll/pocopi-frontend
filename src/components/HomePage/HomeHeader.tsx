import styles from "@/styles/HomePage/HomeHeader.module.css";
import type { TrimmedConfig, AssignedTestGroup } from "@/api";
import { LoginButton } from "@/components/LoginButton";

type HomeHeaderProps = {
  config: TrimmedConfig;
  isDarkMode: boolean;
  goToNextPage?: (group: AssignedTestGroup) => void;
  onAttemptInProgress?: () => void;
};

export function HomeHeader({
                             config,
                             isDarkMode,
                             goToNextPage,
                             onAttemptInProgress
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
          <img className={styles.appIcon} src={config.icon.url} alt={config.icon.alt} />
        )}
      </div>

      <h1 className={styles.title}>{config.title}</h1>

      <div className="flex items-center gap-2">
        {config.subtitle && <div className={styles.subtitle}>{config.subtitle}</div>}

        {config.anonymous && goToNextPage && (
          <LoginButton
            config={config}
            goToNextPage={goToNextPage}
            variant="icon"
            onAttemptInProgress={onAttemptInProgress}
          />
        )}
      </div>
    </div>
  );
}