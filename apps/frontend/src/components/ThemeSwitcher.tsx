import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/components/ThemeSwitcher.module.css";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.themeSwitcher}
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
    >
      <FontAwesomeIcon
        icon={theme === "light" ? faMoon : faSun}
        className={styles.icon}
      />
    </button>
  );
};
