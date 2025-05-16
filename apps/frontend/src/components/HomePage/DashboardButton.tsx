// Botón flotante para acceder al dashboard de administración
// Recibe el tema y la función de navegación como props

import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

interface DashboardButtonProps {
  isDarkMode: boolean;
  onDashboard: () => void;
}

const DashboardButton = ({ isDarkMode, onDashboard }: DashboardButtonProps) => (
  <Button
    variant={isDarkMode ? "dark" : "light"}
    onClick={onDashboard}
    className="position-fixed bottom-0 start-0 m-4 rounded-circle d-flex align-items-center justify-content-center p-0 shadow"
    style={{ width: "48px", height: "48px", zIndex: 1050 }}
    title="Admin Dashboard"
  >
    <FontAwesomeIcon icon={faChartLine} className="text-primary" />
  </Button>
);

export default DashboardButton;
