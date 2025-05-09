import { config } from "@pocopi/config";
import { useState, useEffect, useRef } from "react";
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
import {
  RavenAnalytics,
  saveResultsToStorage,
  saveStudentDataToStorage,
} from "@/utils/RavenAnalytics";
import styles from "./RavenMatrixPage.module.css";

type RavenMatrixPageProps = {
  protocol: string;
  goToNextPage: () => void;
  studentData?: {
    name: string;
    id: string;
    email: string;
    age: string;
  } | null;
};

export function RavenMatrixPage({
  protocol,
  goToNextPage,
  studentData,
}: RavenMatrixPageProps) {
  const [phase, setPhase] = useState<number>(0);
  const [question, setQuestion] = useState<number>(0);
  const [selected, setSelected] = useState<string>("");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const analyticsRef = useRef<RavenAnalytics | null>(null);

  // Inicializar analytics solo una vez al montar
  useEffect(() => {
    analyticsRef.current = new RavenAnalytics("default_group", protocol);

    if (studentData?.id) {
      analyticsRef.current.setParticipantId(studentData.id);
      saveStudentDataToStorage(studentData.id, {
        name: studentData.name,
        email: studentData.email,
        age: studentData.age,
      });
    }

    analyticsRef.current.startQuestion(phase, question);
  }, []);

  // Obtener datos de la pregunta actual
  const { phases } = config.protocols[protocol];
  const { questions } = phases[phase];
  const { img, options: tempOptions } = questions[question];

  // Procesar opciones y detectar respuesta correcta del YAML
  const options = tempOptions.map((option) => {
    const base64 = option.src.split(";")[1].slice(7);
    const half = Math.round(base64.length / 2);
    const id = base64.substring(half - 10, half + 10);

    return {
      id,
      ...option,
      isCorrect:
        option.correct === true ||
        String(option.correct).toLowerCase() === "true",
    };
  });

  // Cálculos de layout
  const optionsColumns = Math.ceil(options.length / 2);
  const isOptionsOdd = options.length % 2 === 1;

  // Calcular progreso
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

  // Función reutilizable para registrar respuesta y actualizar analíticas
  const completeCurrentQuestion = () => {
    if (!selected || !analyticsRef.current) return;

    const selectedOption = options.find((o) => o.id === selected);
    if (selectedOption) {
      analyticsRef.current.completeQuestion(
        selected,
        !!selectedOption.isCorrect
      );
    }
  };

  // Manejadores de navegación
  const handlePreviousPhaseClick = () => {
    if (phase <= 0) return;

    completeCurrentQuestion();
    setSelected("");
    setQuestion(0);
    setPhase(phase - 1);

    analyticsRef.current?.startQuestion(phase - 1, 0);
  };

  const handleNextPhaseClick = () => {
    completeCurrentQuestion();

    if (phase < phases.length - 1) {
      setSelected("");
      setQuestion(0);
      setPhase(phase + 1);
      analyticsRef.current?.startQuestion(phase + 1, 0);
      return;
    }

    // Completar el test
    if (analyticsRef.current) {
      const results = analyticsRef.current.completeTest();
      saveResultsToStorage(results);
    }

    goToNextPage();
  };

  const handlePreviousQuestionClick = () => {
    completeCurrentQuestion();

    if (question <= 0) {
      handlePreviousPhaseClick();
      return;
    }

    setSelected("");
    setQuestion(question - 1);
    analyticsRef.current?.startQuestion(phase, question - 1);
  };

  const handleNextQuestionClick = () => {
    completeCurrentQuestion();

    if (question < questions.length - 1) {
      setSelected("");
      setQuestion(question + 1);
      analyticsRef.current?.startQuestion(phase, question + 1);
      return;
    }

    handleNextPhaseClick();
  };

  const handleRavenOptionClick = (id: string) => {
    return () => {
      if (analyticsRef.current && id !== selected) {
        analyticsRef.current.recordOptionChange();
      }

      setSelected((v) => (v === id ? "" : id));
    };
  };

  return (
    <Container
      fluid
      className="p-0 min-vh-100 position-relative d-flex flex-column"
    >
      {/* Header con barra de progreso */}
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

      {/* Contenido principal */}
      <Container className="py-4 flex-grow-1 d-flex flex-column justify-content-center">
        {/* Imagen de la pregunta */}
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

        {/* Opciones */}
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
                  className={`p-2 text-center ${
                    option.id === selected ? "selected-option" : ""
                  }`}
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

      {/* Navegación inferior */}
      <div
        className={`py-3 px-4 ${
          isDarkMode ? "bg-dark" : "bg-light"
        } border-top`}
      >
        <Row>
          <Col className="d-flex justify-content-between">
            {/* Botón fase anterior */}
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

            {/* Botones anterior/siguiente */}
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

            {/* Botón siguiente fase */}
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

      {/* Estilos CSS personalizados */}
      <style>
        {`
          .selected-option img {
            border-color: ${
              isDarkMode ? "#ffc107 !important" : "#ffc107 !important"
            };
            box-shadow: 0 0 8px rgba(255, 193, 7, 0.5);
          }
          .cursor-pointer {
            cursor: pointer;
          }
        `}
      </style>
    </Container>
  );
}
