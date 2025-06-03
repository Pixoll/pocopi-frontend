import styles from "@/styles/HomePage/DashboardButton.module.css";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type DashboardButtonProps = {
  isDarkMode: boolean;
  onDashboard: () => void;
};

export function DashboardButton({ isDarkMode, onDashboard }: DashboardButtonProps) {
  return (
    <button
      className={[
        styles.dashboardButton,
        isDarkMode ? styles.dashboardButtonDark : styles.dashboardButtonLight,
      ].join(" ")}
      onClick={onDashboard}
      title="Admin Dashboard"
    >
      <FontAwesomeIcon icon={faChartLine} className={styles.icon}/>
    </button>
  );
}
