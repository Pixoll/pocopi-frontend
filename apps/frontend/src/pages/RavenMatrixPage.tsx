import { config } from "@pocopi/config";
import { useState } from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { useTheme } from "@/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faLayerGroup,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./RavenMatrixPage.module.css";

type RavenMatrixPageProps = {
  protocol: string;
  goToNextPage: () => void;
};

export function RavenMatrixPage({
  protocol,
  goToNextPage,
}: RavenMatrixPageProps) {
  const [phase, setPhase] = useState<number>(0);
  const [question, setQuestion] = useState<number>(0);
  const [selected, setSelected] = useState<string>("");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { phases } = config.protocols[protocol];
  const { questions } = phases[phase];
  const { img, options: tempOptions } = questions[question];

  const options = tempOptions.map((option) => {
    const base64 = option.src.split(";")[1].slice(7);
    const half = Math.round(base64.length / 2);
    const id = base64.substring(half - 10, half + 10);

    return { id, ...option };
  });

  const optionsColumns = Math.ceil(options.length / 2);
  const isOptionsOdd = options.length % 2 === 1;

  // Calculate progress percentage
  const totalQuestions = phases.reduce(
    (acc, phase) => acc + phase.questions.length,
    0
  );
  const currentQuestionNumber =
    phases
      .slice(0, phase)
      .reduce((acc, phase) => acc + phase.questions.length, 0) +
    question +
    1;
  const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;

  const handlePreviousPhaseClick = () => {
    setQuestion(0);
    setPhase(phase - 1);
  };

  const handleNextPhaseClick = () => {
    if (phase < phases.length - 1) {
      setQuestion(0);
      setPhase(phase + 1);
      return;
    }

    goToNextPage();
  };

  const handlePreviousQuestionClick = () => {
    if (question <= 0) {
      handlePreviousPhaseClick();
      return;
    }

    setQuestion(question - 1);
  };

  const handleNextQuestionClick = () => {
    if (question < questions.length - 1) {
      setQuestion(question + 1);
      return;
    }

    handleNextPhaseClick();
  };

  const handleRavenOptionClick = (id: string) => {
    return () => setSelected((v) => (v === id ? "" : id));
  };

  return (
    <Container
      fluid
      className="p-0 min-vh-100 position-relative d-flex flex-column"
    >
      {/* Header with progress */}
      <div
        className={`py-3 px-4 ${
          isDarkMode ? "bg-dark" : "bg-light"
        } border-bottom`}
      >
        <Row className="align-items-center gx-4">
          <Col>
            <h4 className="m-0 d-flex align-items-center">
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="me-2 text-primary"
              />
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
              Phase {phase + 1}/{phases.length} - Question {question + 1}/
              {questions.length}
            </span>
          </Col>
        </Row>
      </div>

      {/* Main content */}
      <Container className="py-4 flex-grow-1 d-flex flex-column justify-content-center">
        <Row className="justify-content-center mb-3">
          <Col md={10} lg={8} className="text-center">
            <div
              className={`p-4 rounded-4 mb-4 ${
                isDarkMode ? "bg-dark" : "bg-white"
              } shadow-sm`}
              style={{ userSelect: "none" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="img-fluid"
                style={{ maxWidth: "100%", pointerEvents: "none" }}
                draggable={false}
              />
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div
              className={`${styles.ravenOptionsContainer}`}
              style={{
                gridTemplateColumns: `repeat(${optionsColumns}, ${
                  100 / optionsColumns
                }%)`,
              }}
            >
              {options.map((option, i) => (
                <div
                  key={option.id}
                  className={`
                    p-2 text-center ${
                      option.id === selected ? "selected-option" : ""
                    }
                  `}
                  style={{
                    transform:
                      isOptionsOdd && i % 2 === 1 ? "translateX(50%)" : "none",
                  }}
                >
                  <img
                    className={`
                      img-fluid rounded border p-1 cursor-pointer
                      ${
                        option.id === selected
                          ? "border-warning bg-warning bg-opacity-25"
                          : isDarkMode
                          ? "border-secondary"
                          : "border-light"
                      }
                    `}
                    src={option.src}
                    alt={option.alt}
                    onClick={handleRavenOptionClick(option.id)}
                    draggable={false}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      maxWidth: "90%",
                      transform:
                        option.id === selected ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Bottom navigation */}
      <div
        className={`py-3 px-4 ${
          isDarkMode ? "bg-dark" : "bg-light"
        } border-top`}
      >
        <Row>
          <Col className="d-flex justify-content-between">
            <div>
              <Button
                variant="outline-secondary"
                className="me-2 d-flex align-items-center"
                onClick={handlePreviousPhaseClick}
                disabled={phase === 0}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Previous Phase
              </Button>
            </div>

            <div>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={handlePreviousQuestionClick}
                disabled={question === 0 && phase === 0}
              >
                <FontAwesomeIcon icon={faAngleLeft} className="me-1" />
                Previous
              </Button>

              <Button variant="primary" onClick={handleNextQuestionClick}>
                {question < questions.length - 1 ||
                phase < phases.length - 1 ? (
                  <>
                    Next
                    <FontAwesomeIcon icon={faAngleRight} className="ms-1" />
                  </>
                ) : (
                  <>
                    Finish Test
                    <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                  </>
                )}
              </Button>
            </div>

            <div>
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center"
                onClick={handleNextPhaseClick}
                disabled={phase >= phases.length - 1}
              >
                Next Phase
                <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Add some custom CSS for the selected option */}
      <style>{`
        .selected-option img {
          border-color: ${
            isDarkMode ? "#ffc107 !important" : "#ffc107 !important"
          };
          box-shadow: 0 0 8px rgba(255, 193, 7, 0.5);
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
}
