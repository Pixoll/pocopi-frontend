import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "react-bootstrap";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant={isDark ? "light" : "dark"}
      className="rounded-circle p-0 d-flex align-items-center justify-content-center position-fixed bottom-0 end-0 m-4 shadow"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        width: "48px",
        height: "48px",
        zIndex: 1050,
      }}
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="fs-5" />
    </Button>
  );
};

export default ThemeSwitcher;
