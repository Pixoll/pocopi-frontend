// Header de la página de inicio con título y subtítulo
// Recibe la prop isDarkMode para ajustar el estilo

import appIcon from "/app_icon.png?url";
import styles from "@/styles/HomeHeader.module.css";
import { config } from "@pocopi/config";

type HomeHeaderProps = {
  isDarkMode: boolean;
};

export function HomeHeader({ isDarkMode }: HomeHeaderProps) {
  return (
    <div className={styles.header}>
      {/* Ícono decorativo */}
      <div
        className={[
          styles.iconWrapper,
          isDarkMode ? styles.iconDark : styles.iconLight,
        ].join(" ")}
      >
        <img className={styles.appIcon} src={appIcon} alt="App Icon"/>
      </div>
      {/* Título principal */}
      <h1 className={styles.title}>
        {config.title}
        <span className={styles.highlight}> Matrices Test</span>
      </h1>
      {/* Subtítulo */}
      {config.subtitle && (
        <p className={styles.subtitle}>
          {config.subtitle}
        </p>
      )}
    </div>
  );
}
