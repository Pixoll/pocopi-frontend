import styles from "@/styles/HomePage/DashboardButton.module.css";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {t} from "@/utils/translations.ts";
import type {SingleConfigResponse} from "@/api";

type DashboardButtonProps = {
  config: SingleConfigResponse
  isDarkMode: boolean;
  onDashboard: () => void;
};

export function DashboardButton({ config, isDarkMode, onDashboard }: DashboardButtonProps) {
  return (
    <button
      className={[
        styles.dashboardButton,
        isDarkMode ? styles.dashboardButtonDark : styles.dashboardButtonLight,
      ].join(" ")}
      onClick={onDashboard}
      title={t(config, "home.dashboardButtonHint")}
    >
      <FontAwesomeIcon icon={faChartLine} className={styles.icon}/>
    </button>
  );
}
