// Header con barra de progreso y estado de la fase/pregunta

import { Row, Col, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";

interface RavenMatrixHeaderProps {
  isDarkMode: boolean;
  phase: number;
  phasesCount: number;
  question: number;
  questionsCount: number;
  progressPercentage: number;
}

const RavenMatrixHeader = ({
  isDarkMode,
  phase,
  phasesCount,
  question,
  questionsCount,
  progressPercentage,
}: RavenMatrixHeaderProps) => (
  <div
    className={`py-3 px-4 ${isDarkMode ? "bg-dark" : "bg-light"} border-bottom`}
  >
    <Row className="align-items-center gx-4">
      <Col>
        <h4 className="m-0 d-flex align-items-center">
          <FontAwesomeIcon icon={faLayerGroup} className="me-2 text-primary" />
          <span>Raven's Matrices Test</span>
        </h4>
      </Col>
      <Col md={6}>
        <div className="d-flex align-items-center">
          <small className="text-secondary me-2">Progress:</small>
          <ProgressBar
            now={progressPercentage}
            className="w-100 rounded-pill"
            variant="primary"
            style={{ height: "10px" }}
          />
          <small className="ms-2">{Math.round(progressPercentage)}%</small>
        </div>
      </Col>
      <Col className="text-end">
        <span className="badge bg-primary rounded-pill">
          Phase {phase + 1}/{phasesCount} - Question {question + 1}/
          {questionsCount}
        </span>
      </Col>
    </Row>
  </div>
);

export default RavenMatrixHeader;
