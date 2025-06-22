import { useTheme } from "@/hooks/useTheme";
import type { IdentifiableUserData } from "@/types/user";
import { faEnvelope, faIdCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { Card } from "react-bootstrap";

type CompletionUserInfoProps = {
  userData: IdentifiableUserData;
}

export function CompletionUserInfo({ userData }: CompletionUserInfoProps) {
  const { isDarkMode } = useTheme();

  return (
    <Card
      className={`mb-4 border ${isDarkMode
        ? "bg-dark border-primary border-opacity-25"
        : "bg-light"
      }`}
      style={{
        boxShadow: isDarkMode
          ? "0 0 15px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(121, 132, 255, 0.1)"
          : "0 0 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Card.Body>
        <Card.Title className="h6 mb-3 text-start d-flex align-items-center">
          <span
            className={`me-2 badge ${isDarkMode
              ? "bg-primary-subtle text-primary-emphasis"
              : "bg-light text-secondary"
            }`}
          >
            <FontAwesomeIcon icon={faUser} className="me-1"/>
            {config.t("completion.userInfo")}
          </span>
          {config.t("completion.registrationInformation")}
        </Card.Title>
        <div>
          <div className="d-flex align-items-center mb-3">
            <div
              className={`me-3 p-2 rounded-circle ${isDarkMode
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-light text-success"
              }`}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={faUser}/>
            </div>
            <div className="text-start">
              <div className={`small ${isDarkMode ? "text-primary-emphasis" : "text-secondary"}`}>
                {config.t("completion.name")}
              </div>
              <div className={isDarkMode ? "text-light" : ""}>
                {userData.name}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center mb-3">
            <div
              className={`me-3 p-2 rounded-circle ${isDarkMode
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-light text-success"
              }`}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={faIdCard}/>
            </div>
            <div className="text-start">
              <div className={`small ${isDarkMode ? "text-primary-emphasis" : "text-secondary"}`}>
                {config.t("completion.identification")}
              </div>
              <div className={isDarkMode ? "text-light" : ""}>
                {userData.id}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <div
              className={`me-3 p-2 rounded-circle ${isDarkMode
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-light text-success"
              }`}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={faEnvelope}/>
            </div>
            <div className="text-start">
              <div className={`small ${isDarkMode ? "text-primary-emphasis" : "text-secondary"}`}>
                {config.t("completion.email")}
              </div>
              <div className={isDarkMode ? "text-light" : ""}>
                {userData.email}
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
