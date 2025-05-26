// Header de la página de inicio con título y subtítulo
// Recibe la prop isDarkMode para ajustar el estilo

import styles from "@/styles/HomePage/HomeHeader.module.css";
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
        <img className={styles.appIcon} src={config.icon.src} alt={config.icon.alt}/>
      </div>
      {/* Título principal */}
      <h1 className={styles.title}>
        {config.title}
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
