import api, { type UserSummary } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import type { UserData } from "@/types/user";
import {
  faChartLine,
  faCheck,
  faEnvelope,
  faHome,
  faIdCard,
  faTrophy,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useState } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import dotsBg from "@/assets/dotsBg.svg";

type CompletionModalProps = {
  userData: UserData;
  onBackToHome: () => void;
};

export function CompletionModal({
  userData,
  onBackToHome,
}: CompletionModalProps) {
  const { isDarkMode } = useTheme();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userResult, setUserResult] = useState<UserSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserResult = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.getUserSummary({
        path: {
          userId: userData.id,
        }
      });

      if (!result.data) {
        setError("No se pudo obtener el resultado. Intenta de nuevo.");
      } else {
        setUserResult(result.data);
      }
    } catch {
      setError("No se pudo obtener el resultado. Intenta de nuevo.");
      setUserResult(null);
    } finally {
      setLoading(false);
    }
  };

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
      ></div>

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
              )}

              {/* Card de opciones adicionales */}
              <Card
                className={`mb-4 border ${isDarkMode
                  ? "border-primary border-opacity-25 bg-dark"
                  : "bg-light"
                }`}
                style={{
                  boxShadow: isDarkMode
                    ? "0 0 15px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(121, 132, 255, 0.1)"
                    : "0 0 10px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Card.Body className="p-3">
                  <Card.Title className="h6 mb-3 text-start">
                    {config.t("completion.additionalOptions")}
                  </Card.Title>
                  <Row className="g-2">
                    <Col xs={12}>
                      <Button
                        variant={isDarkMode ? "outline-primary" : "outline-success"}
                        className="w-100 py-2 mb-2"
                        size="sm"
                        onClick={() => {
                          if (!showResults) fetchUserResult();
                          setShowResults((prev) => !prev);
                        }}
                      >
                        <FontAwesomeIcon icon={faChartLine} className="me-2"/>
                        {showResults ? "Ocultar resultados" : config.t("completion.viewResults")}
                      </Button>
                    </Col>
                  </Row>

                  {/* Modal simple para mostrar resultados */}
                  {showResults && (
                    <div
                      className={`mt-3 p-4 rounded-4 position-relative ${isDarkMode
                        ? "bg-dark text-light border border-primary border-opacity-50"
                        : "bg-light border"
                      }`}
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(135deg, rgba(121,132,255,0.10) 0%, rgba(40,45,80,0.95) 100%)"
                          : undefined,
                        boxShadow: isDarkMode
                          ? "0 0 24px 4px #7984ff55, 0 2px 16px 0 #0008"
                          : "0 0 10px #4cc9a255",
                        border: isDarkMode ? "1.5px solid #7984ff88" : undefined,
                        overflow: "hidden",
                      }}
                    >
                      <h5 className="mb-4 fw-bold d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faChartLine} className="text-primary fa-lg"/>
                        Resultados de tu test
                      </h5>

                      {loading && <div>Obteniendo resultados...</div>}
                      {error && <div className="text-danger">{error}</div>}

                      {!loading && !error && userResult && (() => {
                        const totalQuestions = config.getTotalQuestions?.(userResult.group);
                        const omitidas = typeof totalQuestions === "number"
                          ? totalQuestions - userResult.questionsAnswered
                          : null;

                        return (
                          <ul className="list-unstyled mb-0">
                            <li className="mb-3 d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faCheck} className="text-success fa-lg"/>
                              <span>
                                <strong>Preguntas correctas:</strong> {userResult.correctQuestions}
                                {typeof totalQuestions === "number"
                                  ? ` de ${totalQuestions}`
                                  : ` de ${userResult.questionsAnswered} (respondidas)`}
                              </span>
                            </li>
                            {typeof totalQuestions === "number" && (
                              <li className="mb-3 d-flex align-items-center gap-2 border-top border-primary border-opacity-25 pt-3">
                                <FontAwesomeIcon icon={faCheck} className="text-secondary fa-lg"/>
                                <span>
                                  <strong>Preguntas omitidas:</strong> {omitidas}
                                </span>
                              </li>
                            )}
                            <li className="mb-3 d-flex align-items-center gap-2 border-top border-primary border-opacity-25 pt-3">
                              <FontAwesomeIcon icon={faTrophy} className="text-warning fa-lg"/>
                              <span>
                                <strong>Porcentaje de aciertos:</strong> {typeof totalQuestions === "number" && totalQuestions > 0
                                ? ((userResult.correctQuestions / totalQuestions) * 100).toFixed(1)
                                : userResult.questionsAnswered > 0
                                  ? ((userResult.correctQuestions / userResult.questionsAnswered) * 100).toFixed(1)
                                  : "0.0"}%
                              </span>
                            </li>
                            <li className="d-flex align-items-center gap-2 border-top border-primary border-opacity-25 pt-3">
                              <FontAwesomeIcon icon={faChartLine} className="text-info fa-lg"/>
                              <span>
                                <strong>Tiempo total:</strong> {(userResult.timeTaken / 1000).toFixed(1)} segundos
                              </span>
                            </li>
                          </ul>
                        );
                      })()}
                      {!loading && !error && !userResult && (
                        <div>No se encontraron resultados para este usuario.</div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>

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
