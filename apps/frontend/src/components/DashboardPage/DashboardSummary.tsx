import { Summary } from "@/types/summary";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChartLine, faCheckCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { Card, Col, Row } from "react-bootstrap";

type DashboardSummaryProps = {
  isDarkMode: boolean;
  summary: Summary;
};

export function DashboardSummary({ isDarkMode, summary }: DashboardSummaryProps) {
  return (
    <Card className={`border-0 shadow-sm ${isDarkMode ? "bg-dark" : ""}`}>
      <Card.Body>
        <Row className="g-4">
          <Col md={6} lg={3}>
            <StatCard
              title={config.t("dashboard.totalParticipants")}
              value={summary.users.length.toString()}
              icon={faUser}
              isDarkMode={isDarkMode}
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              title={config.t("dashboard.averageAccuracy")}
              value={`${summary.averageAccuracy.toFixed(1)}%`}
              icon={faCheckCircle}
              isDarkMode={isDarkMode}
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              title={config.t("dashboard.averageTimeTaken")}
              value={`${(summary.averageTimeTaken / 1000).toFixed(1)} seg`}
              icon={faChartLine}
              isDarkMode={isDarkMode}
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              title={config.t("dashboard.totalQuestionsAnswered")}
              value={`${summary.totalQuestionsAnswered}`}
              icon={faChartLine}
              isDarkMode={isDarkMode}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  icon: IconProp;
  isDarkMode: boolean;
};

function StatCard({ title, value, icon, isDarkMode }: StatCardProps) {
  return (
    <Card className={`border-0 h-100 ${isDarkMode ? "bg-dark bg-opacity-50 border-secondary" : "bg-white"}`}>
      <Card.Body className="d-flex align-items-center">
        <div className={`me-3 p-3 rounded-circle ${isDarkMode ? "bg-primary bg-opacity-10" : "bg-light"}`}>
          <FontAwesomeIcon icon={icon} className="text-primary fa-lg"/>
        </div>
        <div>
          <h6 className="text-secondary mb-1">{title}</h6>
          <h4 className="mb-0">{value}</h4>
        </div>
      </Card.Body>
    </Card>
  );
}
