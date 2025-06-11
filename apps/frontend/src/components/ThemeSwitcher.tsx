import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/ThemeSwitcher.module.css";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className={[
        styles.themeSwitcher,
        isDark ? styles.themeSwitcherDark : styles.themeSwitcherLight,
      ].join(" ")}
      onClick={toggleTheme}
      aria-label={config.t("home.themeSwitchButtonHint", isDark ? "light" : "dark")}
    >
      <FontAwesomeIcon
        icon={isDark ? faSun : faMoon}
        className={styles.icon}
      />
    </button>
  );
}
