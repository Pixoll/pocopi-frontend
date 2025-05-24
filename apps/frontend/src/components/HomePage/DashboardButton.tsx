// Botón flotante para acceder al dashboard de administración
// Recibe el tema y la función de navegación como props

import styles from "./DashboardButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import classNames from 'classnames';

interface DashboardButtonProps {
  isDarkMode: boolean;
  onDashboard: () => void;
}

const DashboardButton = ({ isDarkMode, onDashboard }: DashboardButtonProps) => (
    <button
        className={classNames(
            styles.dashboardButton,
            {
              [styles.dark]: isDarkMode,
              [styles.light]: !isDarkMode,
            }
        )}
        onClick={onDashboard}
        title="Admin Dashboard"
    >
      <FontAwesomeIcon icon={faChartLine} className={styles.icon}/>
    </button>
);

export default DashboardButton;
