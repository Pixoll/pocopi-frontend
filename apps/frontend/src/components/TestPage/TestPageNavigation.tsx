import { faAngleLeft, faAngleRight, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col } from "react-bootstrap";

type TestPageNavigationProps = {
  onPreviousPhase: () => void;
  onNextPhase: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  disablePreviousPhase: boolean;
  disablePreviousQuestion: boolean;
  disableNextQuestion: boolean;
  disableNextPhase: boolean;
  hidePreviousPhase: boolean;
  hidePreviousQuestion: boolean;
  hideNextPhase: boolean;
  isDarkMode: boolean;
};

export function TestPageNavigation({
  onPreviousPhase,
  onNextPhase,
  onPreviousQuestion,
  onNextQuestion,
  disablePreviousPhase,
  disablePreviousQuestion,
  disableNextQuestion,
  disableNextPhase,
  hidePreviousPhase,
  hidePreviousQuestion,
  hideNextPhase,
  isDarkMode,
}: TestPageNavigationProps) {
  return (
    <div className={`py-3 px-4 border-top ${isDarkMode ? "bg-dark" : "bg-light"}`}>
      <Col className="d-flex justify-content-between position-relative">
        <div>
          <Button
            variant="outline-secondary"
            onClick={onPreviousPhase}
            disabled={disablePreviousPhase}
            hidden={hidePreviousPhase}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
            Previous Phase
          </Button>
        </div>

        <div className={!hidePreviousPhase || !hideNextPhase ? "position-absolute translate-middle-x start-50" : ""}>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={onPreviousQuestion}
            disabled={disablePreviousQuestion}
            hidden={hidePreviousQuestion}
          >
            <FontAwesomeIcon icon={faAngleLeft} className="me-2"/>
            Previous
          </Button>

          <Button
            variant="primary"
            onClick={onNextQuestion}
            disabled={disableNextQuestion}
          >
            Next
            <FontAwesomeIcon icon={faAngleRight} className="ms-2"/>
          </Button>
        </div>

        <div>
          <Button
            variant="outline-secondary"
            onClick={onNextPhase}
            disabled={disableNextPhase}
            hidden={hideNextPhase}
          >
            Next Phase
            <FontAwesomeIcon icon={faArrowRight} className="ms-2"/>
          </Button>
        </div>
      </Col>
    </div>
  );
}
