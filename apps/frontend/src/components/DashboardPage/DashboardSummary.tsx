import styles from "@/styles/DashboardPage/DashboardSummary.module.css";
import { Summary } from "@/types/summary";
import { faChartLine, faCheckCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { config } from "@pocopi/config";
import { StatCard } from "./StatCard";

type DashboardSummaryProps = {
  isDarkMode: boolean;
  summary: Summary;
};

export function DashboardSummary({ isDarkMode, summary }: DashboardSummaryProps) {
  return (
    <div
      className={[
        styles.cardsContainer,
        isDarkMode ? styles.cardsContainerDark : styles.cardsContainerLight,
      ].join(" ")}
    >
      <StatCard
        title={config.t("dashboard.totalParticipants")}
        value={summary.users.length.toString()}
        icon={faUser}
        isDarkMode={isDarkMode}
      />
      <StatCard
        title={config.t("dashboard.averageAccuracy")}
        value={`${summary.averageAccuracy.toFixed(1)}%`}
        icon={faCheckCircle}
        isDarkMode={isDarkMode}
      />
      <StatCard
        title={config.t("dashboard.averageTimeTaken")}
        value={`${(summary.averageTimeTaken / 1000).toFixed(1)} seg`}
        icon={faChartLine}
        isDarkMode={isDarkMode}
      />
      <StatCard
        title={config.t("dashboard.totalQuestionsAnswered")}
        value={`${summary.totalQuestionsAnswered}`}
        icon={faChartLine}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
