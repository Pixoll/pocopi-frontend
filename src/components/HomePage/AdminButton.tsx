import styles from "@/styles/HomePage/AdminButton.module.css";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AdminButtonProps = {
  isDarkMode: boolean;
  onAdmin: () => void;
};

export function AdminButton({isDarkMode, onAdmin }: AdminButtonProps) {
  return (
    <button
      className={[
        styles.adminButton,
        isDarkMode ? styles.adminButtonDark : styles.adminButtonLight,
      ].join(" ")}
      onClick={onAdmin}
      title="Admin"
    >
      <FontAwesomeIcon icon={faCog} className={styles.icon}/>
    </button>
  );
}
