import type {NewUser, Config} from "@/api";
import { faArrowRight, faFileSignature, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ChangeEvent } from "react";
import { Accordion, Button, Card, Col, Form, Row, } from "react-bootstrap";
import Markdown from "react-markdown";
import styles from "@/styles/HomePage/HomeInfoCard.module.css";
import {t} from "@/utils/translations.ts";

type HomeInfoCardProps = {
  config: Config
  isDarkMode: boolean;
  userData: NewUser | null;
  consentAccepted: boolean;
  onConsentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRegister: () => void;
};

export function HomeInfoCard({
                               config,
                               isDarkMode,
                               userData,
                               consentAccepted,
                               onConsentChange,
                               onRegister,
                             }: HomeInfoCardProps) {
  const infoCardsAmount = config.informationCards.length;
  const iconOpacity = isDarkMode ? 0.25 : 0.10;
  const isAnonymous = config.anonymous;

  const faqAmount = config.frequentlyAskedQuestion.length;
  const lastFaqRowIndex = Math.floor((faqAmount - 1) / 2);

  const getButtonProps = () => {
    if (isAnonymous) {
      return {
        text: "Continuar",
        icon: faArrowRight,
        variant: "primary" as const,
        disabled: !consentAccepted
      };
    } else {
      if (!userData) {
        return {
          text: "Iniciar Sesión",
          icon: faSignInAlt,
          variant: "primary" as const,
          disabled: false
        };
      } else {
        return {
          text: t(config, "home.startTest"),
          icon: faArrowRight,
          variant: "success" as const,
          disabled: !consentAccepted
        };
      }
    }
  };

  const buttonProps = getButtonProps();

  return (
    <Card className="shadow-lg border-0 rounded-4 mb-5 overflow-hidden">
      {userData && !userData.anonymous && (
        <div
          className={[
            styles.participantContainer,
            isDarkMode ? styles.participantContainerDark : styles.participantContainerLight,
          ].join(" ")}
        >
          <div
            className={[
              styles.participantIcon,
              isDarkMode ? styles.participantIconDark : styles.participantIconLight,
            ].join(" ")}
          >
            <FontAwesomeIcon icon={faFileSignature}/>
          </div>
          {t(config, "home.participant", userData.name, userData.username)}
        </div>
      )}
      <Card.Body className="p-4 p-md-5">
        <h2 className="h4 mb-4">{t(config, "home.aboutThisTest")}</h2>
        <div className="mb-4">
          <Markdown>{config.description}</Markdown>
        </div>
        {Array.from({ length: Math.ceil(infoCardsAmount / 2) }, (_, i) => (
          <Row key={`info-row-${i}`} className="gx-4 mb-4">
            {config.informationCards.slice(i * 2, i * 2 + 2).map(({ title,description, color, icon }, index) => (
              <Col key={`info-card-${i * 2 + index}`} md={6}>
                <div className="d-flex h-100">
                  <div
                    className="p-2 me-3 mt-1 rounded d-flex align-items-center justify-content-center"
                    style={{
                      height: "40px",
                      width: "40px",
                      backgroundColor: `#${color ?? 'ffffff'}${Math.round(iconOpacity * 255).toString(16).padStart(2, '0')}`
                    }}
                  >
                    {icon && <img src={icon.url} alt={icon.alt} style={{ height: "1em" }}/>}
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
        <div className="border-top pt-4 mb-4">
          <h3 className="h5 mb-3">{t(config, "home.informedConsent")}</h3>
          <div className="mb-4">
            <Markdown>{config.informedConsent}</Markdown>
          </div>
          <Form.Check
            type="checkbox"
            id="consent-checkbox"
            label={t(config, "home.iAcceptInformedConsent")}
            onChange={onConsentChange}
            className="user-select-none fw-bold"
          />
        </div>
        <div className="text-center mt-4">
          <Button
            variant={buttonProps.variant}
            size="lg"
            className="px-5 py-3 rounded-pill shadow-sm"
            onClick={onRegister}
            disabled={buttonProps.disabled}
          >
            <span className="me-2">{buttonProps.text}</span>
            <FontAwesomeIcon icon={buttonProps.icon}/>
          </Button>
        </div>
      </Card.Body>
      {faqAmount > 0 && (
        <Accordion className="border-top" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>{t(config, "home.frequentlyAskedQuestions")}</Accordion.Header>
            <Accordion.Body>
              {Array.from({ length: Math.ceil(faqAmount / 2) }, (_, i) => (
                <Row key={`faq-row-${i}`} className="g-4">
                  {config.frequentlyAskedQuestion.slice(i * 2, i * 2 + 2).map((faq, index) => (
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