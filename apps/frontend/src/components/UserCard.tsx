import { User } from "@/types/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import styles from "@/components/UserCard.module.css";

export const UserCard = ({ user }: { user: User }) => (
  <div className={styles.card}>
    <h3 className={styles.userName}>{user.name}</h3>
    <p className={styles.userEmail}>
      <FontAwesomeIcon icon={faEnvelope} />
      {user.email}
    </p>
  </div>
);
