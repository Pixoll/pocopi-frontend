import styles from "@/styles/DashboardPage/DashboardHeader.module.css";
import { faArrowLeft, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {t} from "@/utils/translations.ts";
import type {Config} from "@/api";

type DashboardHeaderProps = {
  config: Config;
  isDarkMode: boolean;
  onBack: () => void;
};

export function DashboardHeader({ config, isDarkMode, onBack }: DashboardHeaderProps) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>
          <FontAwesomeIcon icon={faChartLine} className={styles.dashboardIcon}/>
          {t(config, "dashboard.analytics", config.title)}
        </h2>

        <button
          onClick={onBack}
          className={[
            styles.backButton,
            isDarkMode ? styles.backButtonDark : styles.backButtonLight,
          ].join(" ")}
        >
          <FontAwesomeIcon icon={faArrowLeft}/>
          {t(config, "dashboard.backToHome")}
        </button>
      </div>

      <span className={styles.subtitle}>
        {t(config, "dashboard.viewAndExportResults")}
      </span>
    </div>
  );
}
