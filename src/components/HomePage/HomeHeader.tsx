import styles from "@/styles/HomePage/HomeHeader.module.css";
import type {TrimmedConfig} from "@/api";

type HomeHeaderProps = {
  config: TrimmedConfig;
  isDarkMode: boolean;
};

export function HomeHeader({config, isDarkMode }: HomeHeaderProps) {
  return (
    <div className={styles.header}>
      <div
        className={[
          styles.iconWrapper,
          isDarkMode ? styles.iconDark : styles.iconLight,
        ].join(" ")}
      >
        {config.icon && (<img className={styles.appIcon} src={config.icon.url} alt={config.icon.alt} />)}
      </div>

      <h1 className={styles.title}>
        {config.title}
      </h1>

      {config.subtitle && (
        <div className={styles.subtitle}>
          {config.subtitle}
        </div>
      )}
    </div>
  );
}
