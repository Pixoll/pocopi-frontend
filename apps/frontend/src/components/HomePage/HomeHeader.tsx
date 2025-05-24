// Header de la página de inicio con título y subtítulo
// Recibe la prop isDarkMode para ajustar el estilo

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
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
          <FontAwesomeIcon
              icon={faBrain}
              style={{fontSize: "2.5rem", color: "#0d6efd"}}
          />
      </div>
      {/* Título principal */}
      <h1 className={styles.title}>
          Raven's Progressive
          <span className={styles.highlight}> Matrices Test</span>
      </h1>
      {/* Subtítulo */}
      <p className={styles.subtitle}>
          An assessment to measure analytical reasoning and problem-solving skills
      </p>
  </div>
);

export default HomeHeader;
