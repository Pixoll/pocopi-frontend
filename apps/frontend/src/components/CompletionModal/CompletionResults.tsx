import api, { type UserSummary } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import type { UserData } from "@/types/user";
import { faChartLine, faCheck, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

type CompletionResultsProps = {
  userData: UserData;
};

export function CompletionResults({ userData }: CompletionResultsProps) {
  const { isDarkMode } = useTheme();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userResult, setUserResult] = useState<UserSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserResult = async () => {
    if (userResult) {
      return;
    }

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

  const onShowResults = () => {
    if (!showResults) {
      fetchUserResult();
    }

    setShowResults((prev) => !prev);
  };

  return (
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
              onClick={onShowResults}
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
  );
}
