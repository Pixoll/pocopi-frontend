import type { TrimmedConfig, UserTestAttempt } from "@/api";
import { LoginModal } from "@/components/HomePage/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/LoginButton.module.css";
import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type LoginButtonProps = {
  config: TrimmedConfig;
  goToNextPage?: (attempt: UserTestAttempt) => void;
  variant?: "icon" | "button";
  showAnonymousOption?: boolean;
  onAttemptInProgress?: () => void;
  className?: string;
};

export function LoginButton({
  config,
  goToNextPage,
  variant = "icon",
  showAnonymousOption = false,
  onAttemptInProgress,
  className = "",
}: LoginButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return null;

  const handleClick = () => {
    setShowModal(true);
  };

  if (variant === "icon") {
    return (
      <>
        <button
          onClick={handleClick}
          className={`${styles.iconButton} ${styles.iconButtonDark} ${className}`}
          title="Iniciar sesión"
        >
          <FontAwesomeIcon icon={faUser} className={styles.icon}/>
        </button>

        <LoginModal
          config={config}
          show={showModal}
          onHide={() => setShowModal(false)}
          goToNextPage={goToNextPage}
          showAnonymousOption={showAnonymousOption}
          onAttemptInProgress={onAttemptInProgress}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`${styles.loginButton} ${className}`}
      >
        <FontAwesomeIcon icon={faRightToBracket}/> Iniciar sesión
      </button>

      <LoginModal
        config={config}
        show={showModal}
        onHide={() => setShowModal(false)}
        goToNextPage={goToNextPage}
        showAnonymousOption={showAnonymousOption}
        onAttemptInProgress={onAttemptInProgress}
      />
    </>
  );
}
