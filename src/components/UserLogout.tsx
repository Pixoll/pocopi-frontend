import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/UserLogout.module.css";

export default function UserLogout() {
  const { username, clearAuth, isLoggedIn } = useAuth();

  if (!isLoggedIn) return null;

  const handleLogout = () => {
      clearAuth();
  };

  return (
    <div className={styles.userMenu}>
      <button className={styles.userButton} onClick={handleLogout}>
        <span className={styles.username}>👤 {username}</span>
        <span className={styles.logoutText}>Cerrar sesión</span>
      </button>
    </div>
  );
}
