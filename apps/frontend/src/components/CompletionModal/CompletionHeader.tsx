import dotsBg from "@/assets/dotsBg.svg";
import { useTheme } from "@/hooks/useTheme";
import { faCheck, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { Badge } from "react-bootstrap";

export function CompletionHeader() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`${isDarkMode ? "bg-primary" : "bg-success"} text-white py-4 position-relative`}
      style={{
        borderBottom: isDarkMode
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "none",
      }}
    >
      {/* Fondo SVG decorativo */}
      <div
        className="position-absolute start-0 top-0 bottom-0 end-0"
        style={{ background: `url('${dotsBg}')` }}
      />
      <div className="position-relative">
        <div
          className={`mb-3 d-inline-flex p-3 rounded-circle ${isDarkMode
            ? "bg-primary-subtle"
            : "bg-success bg-opacity-25"
          }`}
          style={{
            boxShadow: isDarkMode
              ? "0 0 20px rgba(121, 132, 255, 0.4)"
              : "0 0 20px rgba(76, 201, 162, 0.4)",
          }}
        >
          <FontAwesomeIcon icon={faTrophy} className="fa-3x"/>
        </div>
        <h2 className="h3 mb-0">{config.t("completion.testCompleted")}</h2>
        <Badge
          bg={isDarkMode ? "primary" : "light"}
          text={isDarkMode ? "light" : "success"}
          className="mt-2"
          style={{
            boxShadow: isDarkMode
              ? "0 0 10px rgba(121, 132, 255, 0.3)"
              : "0 0 10px rgba(76, 201, 162, 0.3)",
          }}
        >
          <FontAwesomeIcon icon={faCheck} className="me-1"/>
          {config.t("completion.successfullySubmitted")}
        </Badge>
      </div>
    </div>
  );
}
