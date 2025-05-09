import { useState } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Accordion,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlask,
  faFileSignature,
  faArrowRight,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import StudentFormModal from "@/components/StudentFormModal";
import { useTheme } from "@/hooks/useTheme";

interface StudentData {
  name: string;
  id: string;
  email: string;
  age: string;
}

interface HomePageProps {
  onStartTest: (data: StudentData) => void;
}

const HomePage = ({ onStartTest }: HomePageProps) => {
  const [showModal, setShowModal] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleStartTest = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFormSubmit = (data: StudentData) => {
    setStudentData(data);
    setShowModal(false);
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsentAccepted(e.target.checked);
  };

  const startTest = () => {
    if (studentData && consentAccepted) {
      onStartTest(studentData);
    }
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} md={10} lg={8} xl={7}>
          {/* Header */}
          <div className="text-center mb-5 fade-in">
            <div
              className={`d-inline-block mb-3 p-3 rounded-circle ${
                isDarkMode
                  ? "bg-primary bg-opacity-25"
                  : "bg-primary bg-opacity-10"
              }`}
            >
              <FontAwesomeIcon
                icon={faBrain}
                className="text-primary"
                style={{ fontSize: "2.5rem" }}
              />
            </div>
            <h1 className="display-4 fw-bold mb-3">
              Raven's Progressive
              <span className="text-primary"> Matrices Test</span>
            </h1>
            <p className="lead opacity-75 mb-0">
              An assessment to measure analytical reasoning and problem-solving
              skills
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-lg border-0 rounded-4 mb-5 overflow-hidden">
            {/* Info Alert - Only shows if there is student data */}
            {studentData && (
              <Alert variant="info" className="mb-0 border-0 rounded-0">
                <div className="d-flex align-items-center">
                  <div
                    className={`p-2 me-3 rounded-circle ${
                      isDarkMode
                        ? "bg-info bg-opacity-25"
                        : "bg-info bg-opacity-25"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faFileSignature}
                      className="text-info"
                    />
                  </div>
                  <div>
                    <strong>Participant: </strong>
                    {studentData.name} ({studentData.id})
                  </div>
                </div>
              </Alert>
            )}

            <Card.Body className="p-4 p-md-5">
              <h2 className="h4 mb-4">About this test</h2>

              <p className="mb-4">
                Raven's Progressive Matrices Test is one of the most widely
                used tools for assessing non-verbal intelligence and reasoning.
                In this test, you will be presented with a series of matrices
                or designs with a missing part. Your task will be to select,
                from several options, the one that correctly completes the
                pattern.
              </p>

              <Row className="gx-4 mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="d-flex h-100">
                    <div
                      className={`p-2 me-3 mt-1 rounded d-flex align-items-center justify-content-center ${
                        isDarkMode
                          ? "bg-primary bg-opacity-25"
                          : "bg-primary bg-opacity-10"
                      }`}
                      style={{ height: "40px", width: "40px" }}
                    >
                      <FontAwesomeIcon
                        icon={faFlask}
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <h5 className="h6 mb-2">Scientific purpose</h5>
                      <p className="small text-secondary mb-0">
                        This test is part of academic research in the field of
                        psychometrics.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex h-100">
                    <div
                      className={`p-2 me-3 mt-1 rounded d-flex align-items-center justify-content-center ${
                        isDarkMode
                          ? "bg-success bg-opacity-25"
                          : "bg-success bg-opacity-10"
                      }`}
                      style={{ height: "40px", width: "40px" }}
                    >
                      <FontAwesomeIcon
                        icon={faFileSignature}
                        className="text-success"
                      />
                    </div>
                    <div>
                      <h5 className="h6 mb-2">Voluntary participation</h5>
                      <p className="small text-secondary mb-0">
                        Your participation is completely voluntary, and the
                        data will be treated confidentially.
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="border-top pt-4 mb-4">
                <h3 className="h5 mb-3">Informed Consent</h3>
                <div className="mb-4">
                  <p>
                    By agreeing to participate in this study, you acknowledge
                    that:
                  </p>
                  <ul>
                    <li>Your participation is completely voluntary.</li>
                    <li>
                      The data provided will be treated with confidentiality.
                    </li>
                    <li>
                      The information collected will be used solely for
                      academic purposes.
                    </li>
                    <li>
                      You can leave the test at any time if you wish.
                    </li>
                  </ul>
                  <p>
                    The test has no time limit, but it is recommended to
                    complete it without interruptions. If you have any
                    questions about the study, you can contact the research
                    team at{" "}
                    <a href="mailto:research@example.com">
                      research@example.com
                    </a>
                    .
                  </p>
                </div>

                <Form.Check
                  type="checkbox"
                  id="consent-checkbox"
                  label="I have read and accept the informed consent"
                  checked={consentAccepted}
                  onChange={handleConsentChange}
                  className="user-select-none fw-bold"
                />
              </div>

              <div className="text-center mt-4">
                {!studentData ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="px-5 py-3 rounded-pill shadow-sm"
                    onClick={handleStartTest}
                  >
                    <span className="me-2">Start Test</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="lg"
                    className="px-5 py-3 rounded-pill shadow-sm"
                    onClick={startTest}
                    disabled={!consentAccepted}
                  >
                    <span className="me-2">Begin Assessment</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Button>
                )}
              </div>
            </Card.Body>

            {/* Optional: Frequently Asked Questions in an accordion */}
            <Accordion className="border-top" flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Frequently Asked Questions</Accordion.Header>
                <Accordion.Body>
                  <Row className="g-4">
                    <Col md={6}>
                      <h5 className="h6 fw-bold">
                        How long does it take to complete the test?
                      </h5>
                      <p className="small text-secondary mb-3">
                        The time varies depending on the person, but it
                        generally takes between 20 and 45 minutes.
                      </p>

                      <h5 className="h6 fw-bold">
                        Can I pause the test and continue later?
                      </h5>
                      <p className="small text-secondary mb-0">
                        It is recommended to complete the test without
                        interruptions to obtain more accurate results.
                      </p>
                    </Col>
                    <Col md={6}>
                      <h5 className="h6 fw-bold">
                        How will my data be used?
                      </h5>
                      <p className="small text-secondary mb-3">
                        The data will be used solely for academic purposes and
                        will be presented anonymously.
                      </p>

                      <h5 className="h6 fw-bold">Will I receive my results?</h5>
                      <p className="small text-secondary mb-0">
                        At the end of the test, you will be provided with
                        information about your performance.
                      </p>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card>

          <StudentFormModal
            show={showModal}
            onHide={handleCloseModal}
            onSubmit={handleFormSubmit}
          />
        </Col>
      </Row>
      <ThemeSwitcher />
    </Container>
  );
};

export default HomePage;
