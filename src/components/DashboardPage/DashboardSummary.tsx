import styles from "@/styles/DashboardPage/DashboardSummary.module.css";
import { faChartLine, faCheckCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { StatCard } from "./StatCard";
import type {TrimmedConfig, UsersSummary} from "@/api";
import {t} from "@/utils/translations.ts";

type DashboardSummaryProps = {
  config: TrimmedConfig;
  isDarkMode: boolean;
  summary: UsersSummary;
};

export function DashboardSummary({config, isDarkMode, summary }: DashboardSummaryProps) {
  return (
    <div
      className={[
        styles.cardsContainer,
        isDarkMode ? styles.cardsContainerDark : styles.cardsContainerLight,
      ].join(" ")}
    >
      <StatCard
        title={t(config, "dashboard.totalParticipants")}
        value={summary.users.length.toString()}
        icon={faUser}
        isDarkMode={isDarkMode}
      />
      <StatCard
        title={t(config, "dashboard.averageAccuracy")}
        value={`${summary.averageAccuracy.toFixed(1)}%`}
        icon={faCheckCircle}
        isDarkMode={isDarkMode}
      />
      <StatCard
        title={t(config, "dashboard.averageTimeTaken")}
        value={`${(summary.averageTimeTaken / 1000).toFixed(1)} seg`}
        icon={faChartLine}
        isDarkMode={isDarkMode}
      />
      <StatCard
        title={t(config, "dashboard.totalQuestionsAnswered")}
        value={`${summary.totalQuestionsAnswered}`}
        icon={faChartLine}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
