import { CompletionHeader } from "@/components/CompletionModal/CompletionHeader";
import { CompletionResults } from "@/components/CompletionModal/CompletionResults";
import { CompletionUserInfo } from "@/components/CompletionModal/CompletionUserInfo";
import { useTheme } from "@/hooks/useTheme";
import type { UserData } from "@/types/user";
import { faHome, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

type CompletionModalProps = {
  userData: UserData;
  onBackToHome: () => void;
};

export function CompletionModal({
  userData,
  onBackToHome,
}: CompletionModalProps) {
  const { isDarkMode } = useTheme();

  return (
    <Container
      fluid
      className={
        `min-vh-100 d-flex align-items-center justify-content-center py-5 ${isDarkMode ? "bg-dark" : "bg-light"}`
      }
    >
      {/* Fondo decorativo */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: isDarkMode
            ? "radial-gradient(circle, rgba(121, 132, 255, 0.05) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(0, 0, 0, 0.02) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Row
        className="justify-content-center w-100 position-relative"
        style={{ zIndex: 1 }}
      >
        <Col xs={12} md={8} lg={6} xl={5}>
          {/* Card principal */}
          <Card
            className={
              `shadow-lg border-0 rounded-4 overflow-hidden text-center ${isDarkMode ? "bg-dark text-light" : ""}`
            }
            style={{
              boxShadow: isDarkMode
                ? "0 0 30px rgba(121, 132, 255, 0.2), 0 0 10px rgba(0, 0, 0, 0.3)"
                : "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Encabezado con ícono y mensaje */}
            <CompletionHeader/>

            {/* Cuerpo del card */}
            <Card.Body className={`p-4 p-md-5 ${isDarkMode ? "bg-dark" : ""}`}>
              <div className="mb-4">
                <h4 className="h5 mb-4">
                  {config.t("completion.thankYou", !userData.anonymous ? userData.name : "")}
                </h4>
                <p className="lead">
                  {config.t("completion.successfullyCompleted", config.title)}
                </p>
              </div>

              {/* Card de información del usuario */}
              {!userData.anonymous && (
                <CompletionUserInfo userData={userData}/>
              )}

              {/* Card de opciones adicionales */}
              <CompletionResults userData={userData}/>

              <p className={`small mb-4 ${isDarkMode ? "text-light opacity-75" : "text-secondary"}`}>
                {config.t("completion.resultsRecorded")}
              </p>

              {/* Botón para regresar a la página principal */}
              <div className="d-grid">
                <Button
                  variant={isDarkMode ? "primary" : "success"}
                  size="lg"
                  className="rounded-pill py-3"
                  onClick={onBackToHome}
                  style={{
                    boxShadow: isDarkMode
                      ? "0 0 20px rgba(121, 132, 255, 0.4)"
                      : "0 0 20px rgba(76, 201, 162, 0.3)",
                    background: isDarkMode
                      ? "linear-gradient(135deg, #7984ff 0%, #5465e6 100%)"
                      : "linear-gradient(135deg, #4cc9a2 0%, #38b385 100%)",
                    border: "none",
                  }}
                >
                  <FontAwesomeIcon icon={faHome} className="me-2"/>
                  {config.t("completion.backToHome")}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
