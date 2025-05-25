import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/hooks/useTheme";
import styles from "./ThemeSwitcher.module.css";
import classNames from "classnames";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
      <button
          className={classNames(
              styles.themeSwitcher,
              {
                  [styles.themeSwitcherDark]: isDark,
                  [styles.themeSwitcherLight]: !isDark,
              }
          )}
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
          <FontAwesomeIcon
              icon={isDark ? faSun : faMoon}
              className={styles.icon}
          />
      </button>
  );
};

export default ThemeSwitcher;
