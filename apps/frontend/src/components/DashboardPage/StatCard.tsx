import styles from "@/styles/DashboardPage/StatCard.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type StatCardProps = {
  title: string;
  value: string;
  icon: IconProp;
  isDarkMode: boolean;
};

export function StatCard({ title, value, icon, isDarkMode }: StatCardProps) {
  return (
    <div className={styles.card}>
      <FontAwesomeIcon
        icon={icon}
        className={[
          styles.icon,
          isDarkMode ? styles.iconDark : styles.iconLight,
        ].join(" ")}
      />

      <div>
        <h6 className={styles.title}>{title}</h6>
        <h4 className={styles.value}>{value}</h4>
      </div>
    </div>
  );
}
