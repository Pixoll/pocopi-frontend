// Componente para la navegación inferior del test (fases y preguntas)

import { faAngleLeft, faArrowLeft, faArrowRight, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Row } from "react-bootstrap";

type RavenMatrixNavigationProps = {
  phase: number;
  phasesCount: number;
  question: number;
  questionsCount: number;
  onPreviousPhase: () => void;
  onNextPhase: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  disablePrevious: boolean;
  disableNextPhase: boolean;
  isDarkMode: boolean;
};

export function RavenMatrixNavigation({
  onPreviousPhase,
  onNextPhase,
  onPreviousQuestion,
  onNextQuestion,
  disablePrevious,
  disableNextPhase,
  isDarkMode,
}: RavenMatrixNavigationProps) {
  return (
    <div
      className={`py-3 px-4 border-top ${isDarkMode ? "bg-dark" : "bg-light"}`}
    >
      <Row>
        <Col className="d-flex justify-content-between">
          {/* Botón fase anterior */}
          <div>
            <Button
              variant="outline-secondary"
              className="me-2 d-flex align-items-center"
              onClick={onPreviousPhase}
              disabled={disablePrevious}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
              Previous Phase
            </Button>
          </div>
          {/* Botones anterior/siguiente pregunta */}
          <div>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={onPreviousQuestion}
              disabled={disablePrevious}
            >
              <FontAwesomeIcon icon={faAngleLeft} className="me-1"/>
              Previous
            </Button>
            <Button variant="primary" onClick={onNextQuestion}>
              Next
              <FontAwesomeIcon icon={faArrowRight} className="ms-1"/>
            </Button>
          </div>
          {/* Botón siguiente fase */}
          <div>
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center"
              onClick={onNextPhase}
              disabled={disableNextPhase}
            >
              Next Phase
              <FontAwesomeIcon icon={faArrowRight} className="ms-2"/>
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
