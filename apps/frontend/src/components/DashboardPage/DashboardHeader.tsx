import styles from "@/styles/DashboardPage/DashboardHeader.module.css";
import { faArrowLeft, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";

type DashboardHeaderProps = {
  isDarkMode: boolean;
  onBack: () => void;
};

export function DashboardHeader({ isDarkMode, onBack }: DashboardHeaderProps) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>
          <FontAwesomeIcon icon={faChartLine} className={styles.dashboardIcon}/>
          {config.t("dashboard.analytics", config.title)}
        </h2>

        <button
          onClick={onBack}
          className={[
            styles.backButton,
            isDarkMode ? styles.backButtonDark : styles.backButtonLight,
          ].join(" ")}
        >
          <FontAwesomeIcon icon={faArrowLeft}/>
          {config.t("dashboard.backToHome")}
        </button>
      </div>

      <span className={styles.subtitle}>
        {config.t("dashboard.viewAndExportResults")}
      </span>
    </div>
  );
}
