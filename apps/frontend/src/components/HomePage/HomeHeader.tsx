// Header de la página de inicio con título y subtítulo
// Recibe la prop isDarkMode para ajustar el estilo

import appIcon from "/app_icon.png?url";
import { config } from "@pocopi/config";
import "./HomeHeader.css"
import styles from "./HomeHeader.module.css";
import classNames from 'classnames';

interface HomeHeaderProps {
  isDarkMode: boolean;
}

const HomeHeader = ({ isDarkMode }: HomeHeaderProps) => (
  <div className={styles.header}>
    {/* Ícono decorativo */}
      <div
          className={classNames(
              styles.iconWrapper,
              {
                  [styles.iconDark]: isDarkMode,
                  [styles.iconLight]: !isDarkMode,
              }
          )}
      >
          <img className={styles.appIcon} src={appIcon} alt="App Icon"/>
      </div>
      {/* Título principal */}
      <h1 className={styles.title}>
      {config.title}
          <span className={styles.highlight}> Matrices Test</span>
      </h1>
      {/* Subtítulo */}
      <p className={styles.subtitle}>
          {config.subtitle}
      </p>
  </div>
);

export default HomeHeader;
