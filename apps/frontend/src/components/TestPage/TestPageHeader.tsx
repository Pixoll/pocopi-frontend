import styles from "@/styles/TestPageHeader.module.css";
import { config } from "@pocopi/config";
import { Col, ProgressBar, Row } from "react-bootstrap";

type TestPageHeaderProps = {
  isDarkMode: boolean;
  phase: number;
  phasesCount: number;
  question: number;
  questionsCount: number;
  progressPercentage: number;
};

export function TestPageHeader({
  isDarkMode,
  phase,
  phasesCount,
  question,
  questionsCount,
  progressPercentage,
}: TestPageHeaderProps) {
  return (
    <div
      className={`py-3 px-4 ${isDarkMode ? "bg-dark" : "bg-light"} border-bottom`}
    >
      <Row className="align-items-center gx-4">
        <Col>
          <h4 className="m-0 d-flex align-items-center">
            <img className={styles.icon} src={config.icon.src} alt={config.icon.alt}/>
            <span>{config.title}</span>
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
}
