import { faArrowLeft, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { Button, Col, Row } from "react-bootstrap";

type DashboardHeaderProps = {
  isDarkMode: boolean;
  onBack: () => void;
};

export function DashboardHeader({ isDarkMode, onBack }: DashboardHeaderProps) {
  return (
    <Row className="mb-4">
      <Col>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={faChartLine}
              className="me-2 text-primary"
            />
            {config.t("dashboard.analytics", config.title)}
          </h2>
          <Button
            variant={isDarkMode ? "outline-light" : "outline-dark"}
            onClick={onBack}
            className="d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
            {config.t("dashboard.backToHome")}
          </Button>
        </div>
        <p className="text-secondary">
          {config.t("dashboard.viewAndExportResults")}
        </p>
      </Col>
    </Row>
  );
}
