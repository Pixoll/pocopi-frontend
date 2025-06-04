// Tarjeta principal con información del test, consentimiento y botones de acción
// Recibe props para controlar el estado y las acciones

import { UserData } from "@/types/user";
import { faArrowRight, faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { ChangeEvent } from "react";
import { Accordion, Alert, Button, Card, Col, Form, Row, } from "react-bootstrap";
import Markdown from "react-markdown";

type HomeInfoCardProps = {
  isDarkMode: boolean;
  userData: UserData | null;
  consentAccepted: boolean;
  onConsentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onStartTest: () => void;
  onBeginAssessment: () => void;
};

export function HomeInfoCard({
  isDarkMode,
  userData,
  consentAccepted,
  onConsentChange,
  onStartTest,
  onBeginAssessment,
}: HomeInfoCardProps) {
  const infoCardsAmount = config.informationCards.length;
  const iconOpacity = isDarkMode ? 0.25 : 0.10;

  const faqAmount = config.faq.length;
  const lastFaqRowIndex = Math.floor((faqAmount - 1) / 2);

  return (
    <Card className="shadow-lg border-0 rounded-4 mb-5 overflow-hidden">
      {/* Alerta con datos del participante si ya se ingresaron */}
      {userData && !userData.anonymous && (
        <Alert variant="info" className="mb-0 border-0 rounded-0">
          <div className="d-flex align-items-center">
            <div
              className={`p-2 me-3 rounded-circle bg-info ${isDarkMode ? "bg-opacity-25" : "bg-opacity-10"
                }`}
            >
              <FontAwesomeIcon icon={faFileSignature} className="text-info" />
            </div>
            <div>
              <strong>Participant: </strong>
              {userData.name} ({userData.id})
            </div>
          </div>
        </Alert>
      )}
      <Card.Body className="p-4 p-md-5">
        {/* Información sobre el test */}
        <h2 className="h4 mb-4">About this test</h2>
        <div className="mb-4">
          <Markdown>{config.description}</Markdown>
        </div>
        {Array.from({ length: Math.ceil(infoCardsAmount / 2) }, (_, i) => (
          <Row key={`info-row-${i}`} className="gx-4 mb-4">
            {config.informationCards.slice(i * 2, i * 2 + 2).map(({ title, description, color, icon }, index) => (
              <Col key={`info-card-${i * 2 + index}`} md={6}>
                <div className="d-flex h-100">
                  <div
                    className="p-2 me-3 mt-1 rounded d-flex align-items-center justify-content-center"
                    style={{
                      height: "40px",
                      width: "40px",
                      backgroundColor: `rgba(${color?.r ?? 255}, ${color?.g ?? 255}, ${color?.b ?? 255}, ${iconOpacity})`,
                    }}
                  >
                    {icon && <img src={icon.src} alt={icon.alt} style={{ height: "1em" }} />}
                  </div>
                  <div>
                    <h5 className="h6 mb-2">{title}</h5>
                    <p className="small text-secondary mb-0">{description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ))}
        {/* Consentimiento informado */}
        <div className="border-top pt-4 mb-4">
          <h3 className="h5 mb-3">Informed Consent</h3>
          <div className="mb-4">
            <Markdown>{config.informedConsent}</Markdown>
          </div>
          <Form.Check
            type="checkbox"
            id="consent-checkbox"
            label="I have read and accept the informed consent"
            onChange={onConsentChange}
            className="user-select-none fw-bold"
          />
        </div>
        {/* Botón para iniciar el test o continuar */}
        <div className="text-center mt-4">
          {!userData && !config.anonymous ? (
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
      {faqAmount > 0 && (
        <Accordion className="border-top" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Frequently Asked Questions</Accordion.Header>
            <Accordion.Body>
              {Array.from({ length: Math.ceil(faqAmount / 2) }, (_, i) => (
                <Row key={`faq-row-${i}`} className="g-4">
                  {config.faq.slice(i * 2, i * 2 + 2).map((faq, index) => (
                    <Col key={`faq-${i * 2 + index}`} md={6}>
                      <h5 className="h6 fw-bold">
                        {faq.question}
                      </h5>
                      <p className={`small text-secondary ${i < lastFaqRowIndex ? "mb-3" : "mb-0"}`}>
                        {faq.answer}
                      </p>
                    </Col>
                  ))}
                </Row>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
    </Card>
  );
}