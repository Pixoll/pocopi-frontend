import styles from "@/styles/HomePage/HomeHeader.module.css";
import type {SingleConfigResponse} from "@/api";

type HomeHeaderProps = {
  config: SingleConfigResponse;
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
        {/*<img className={styles.appIcon} src={config.icon.src} alt={config.icon.alt} />*/}
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
