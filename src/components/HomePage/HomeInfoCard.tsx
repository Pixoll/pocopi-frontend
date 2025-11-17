import type { TrimmedConfig, UserTestAttempt } from "@/api";
import api from "@/api";
import { LoginModal } from "@/components/HomePage/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginLogic } from "@/hooks/useLoginLogic";
import { t } from "@/utils/translations";
import { faArrowRight, faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useState } from "react";
import { Accordion, Button, Card, Col, Form, Row } from "react-bootstrap";
import Markdown from "react-markdown";

type HomeInfoCardProps = {
  config: TrimmedConfig;
  isDarkMode: boolean;
  consentAccepted: boolean;
  onConsentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  goToNextPage: (attempt: UserTestAttempt) => void;
  onAttemptInProgress: () => void;
};

export function HomeInfoCard({
  config,
  isDarkMode,
  consentAccepted,
  onConsentChange,
  goToNextPage,
  onAttemptInProgress,
}: HomeInfoCardProps) {
  const { isLoggedIn, token } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [checkingExistingAttempt, setCheckingExistingAttempt] = useState(false);
  const { createAnonymousUser, saving } = useLoginLogic({
    config,
    onSuccess: goToNextPage,
    onAttemptInProgress,
  });

  const infoCardsAmount = config.informationCards.length;
  const iconOpacity = isDarkMode ? 0.25 : 0.10;
  const isAnonymous = config.anonymous;

  const faqAmount = config.frequentlyAskedQuestion.length;
  const lastFaqRowIndex = Math.floor((faqAmount - 1) / 2);

  const handleStartTest = async () => {
    if (!isLoggedIn) {
      if (isAnonymous) {
        await createAnonymousUser();
      } else {
        setShowLoginModal(true);
      }
      return;
    }

    if (!token) return;

    setCheckingExistingAttempt(true);
    try {
      const response = await api.beginTest();

      if (response.data) {
        goToNextPage(response.data);
      } else if (response.error && response.error.code === 409) {
        onAttemptInProgress();
      } else if (response.error) {
        console.error("Error starting test:", response.error.message);
      }
    } catch (error) {
      console.error("Error starting test:", error);
    } finally {
      setCheckingExistingAttempt(false);
    }
  };

  const getButtonProps = () => {
    if (checkingExistingAttempt) {
      return {
        text: "Verificando...",
        icon: faArrowRight,
        variant: "primary" as const,
        disabled: true
      };
    }

    if (isAnonymous) {
      return {
        text: saving ? "Iniciando..." : t(config, "home.startTest"),
        icon: faUserPlus,
        variant: "primary" as const,
        disabled: !consentAccepted || saving
      };
    } else {
      if (!isLoggedIn) {
        return {
          text: t(config, "home.startTest"),
          icon: faSignInAlt,
          variant: "primary" as const,
          disabled: !consentAccepted
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
    <>
      <Card className="shadow-lg border-0 rounded-4 mb-5 overflow-hidden">
        <Card.Body className="p-4 p-md-5">
          <h2 className="h4 mb-4">{t(config, "home.aboutThisTest")}</h2>
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
                        backgroundColor: `#${color ?? "ffffff"}${Math.round(iconOpacity * 255).toString(16).padStart(2, "0")}`
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
              onClick={handleStartTest}
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

      {!isAnonymous && (
        <LoginModal
          config={config}
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          goToNextPage={goToNextPage}
          showAnonymousOption={false}
          onAttemptInProgress={onAttemptInProgress}
        />
      )}
    </>
  );
}
