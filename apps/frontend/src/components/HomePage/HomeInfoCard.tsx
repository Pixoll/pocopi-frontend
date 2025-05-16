// Tarjeta principal con información del test, consentimiento y botones de acción
// Recibe props para controlar el estado y las acciones

import {
  Card,
  Row,
  Col,
  Form,
  Accordion,
  Alert,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlask,
  faFileSignature,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

interface StudentData {
  name: string;
  id: string;
  email: string;
  age: string;
}

interface HomeInfoCardProps {
  isDarkMode: boolean;
  studentData: StudentData | null;
  consentAccepted: boolean;
  onConsentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartTest: () => void;
  onBeginAssessment: () => void;
}

const HomeInfoCard = ({
  isDarkMode,
  studentData,
  consentAccepted,
  onConsentChange,
  onStartTest,
  onBeginAssessment,
}: HomeInfoCardProps) => (
  <Card className="shadow-lg border-0 rounded-4 mb-5 overflow-hidden">
    {/* Alerta con datos del participante si ya se ingresaron */}
    {studentData && (
      <Alert variant="info" className="mb-0 border-0 rounded-0">
        <div className="d-flex align-items-center">
          <div
            className={`p-2 me-3 rounded-circle ${
              isDarkMode ? "bg-info bg-opacity-25" : "bg-info bg-opacity-25"
            }`}
          >
            <FontAwesomeIcon icon={faFileSignature} className="text-info" />
          </div>
          <div>
            <strong>Participant: </strong>
            {studentData.name} ({studentData.id})
          </div>
        </div>
      </Alert>
    )}
    <Card.Body className="p-4 p-md-5">
      {/* Información sobre el test */}
      <h2 className="h4 mb-4">About this test</h2>
      <p className="mb-4">
        Raven's Progressive Matrices Test is one of the most widely used tools
        for assessing non-verbal intelligence and reasoning. In this test, you
        will be presented with a series of matrices or designs with a missing
        part. Your task will be to select, from several options, the one that
        correctly completes the pattern.
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
              <FontAwesomeIcon icon={faFlask} className="text-primary" />
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
                Your participation is completely voluntary, and the data will be
                treated confidentially.
              </p>
            </div>
          </div>
        </Col>
      </Row>
      {/* Consentimiento informado */}
      <div className="border-top pt-4 mb-4">
        <h3 className="h5 mb-3">Informed Consent</h3>
        <div className="mb-4">
          <p>By agreeing to participate in this study, you acknowledge that:</p>
          <ul>
            <li>Your participation is completely voluntary.</li>
            <li>The data provided will be treated with confidentiality.</li>
            <li>
              The information collected will be used solely for academic
              purposes.
            </li>
            <li>You can leave the test at any time if you wish.</li>
          </ul>
          <p>
            The test has no time limit, but it is recommended to complete it
            without interruptions. If you have any questions about the study,
            you can contact the research team at{" "}
            <a href="mailto:research@example.com">research@example.com</a>.
          </p>
        </div>
        <Form.Check
          type="checkbox"
          id="consent-checkbox"
          label="I have read and accept the informed consent"
          checked={consentAccepted}
          onChange={onConsentChange}
          className="user-select-none fw-bold"
        />
      </div>
      {/* Botón para iniciar el test o continuar */}
      <div className="text-center mt-4">
        {!studentData ? (
          <Button
            variant="primary"
            size="lg"
            className="px-5 py-3 rounded-pill shadow-sm"
            onClick={onStartTest}
          >
            <span className="me-2">Start Test</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        ) : (
          <Button
            variant="success"
            size="lg"
            className="px-5 py-3 rounded-pill shadow-sm"
            onClick={onBeginAssessment}
            disabled={!consentAccepted}
          >
            <span className="me-2">Begin Assessment</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        )}
      </div>
    </Card.Body>
    {/* Preguntas frecuentes en un acordeón */}
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
                The time varies depending on the person, but it generally takes
                between 20 and 45 minutes.
              </p>
              <h5 className="h6 fw-bold">
                Can I pause the test and continue later?
              </h5>
              <p className="small text-secondary mb-0">
                It is recommended to complete the test without interruptions to
                obtain more accurate results.
              </p>
            </Col>
            <Col md={6}>
              <h5 className="h6 fw-bold">How will my data be used?</h5>
              <p className="small text-secondary mb-3">
                The data will be used solely for academic purposes and will be
                presented anonymously.
              </p>
              <h5 className="h6 fw-bold">Will I receive my results?</h5>
              <p className="small text-secondary mb-0">
                At the end of the test, you will be provided with information
                about your performance.
              </p>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </Card>
);

export default HomeInfoCard;
