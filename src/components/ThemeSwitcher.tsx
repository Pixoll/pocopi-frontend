import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/ThemeSwitcher.module.css";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {t} from "@/utils/translations.ts";
import type {Config} from "@/api";

export function ThemeSwitcher({config}:{config:Config}) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className={[
        styles.themeSwitcher,
        isDarkMode ? styles.themeSwitcherDark : styles.themeSwitcherLight,
      ].join(" ")}
      onClick={toggleTheme}
      aria-label={t(config, "home.themeSwitchButtonHint", isDarkMode ? "light" : "dark")}
    >
      <FontAwesomeIcon
        icon={isDarkMode ? faSun : faMoon}
        className={styles.icon}
      />
    </button>
  );
}
