import styles from "@/styles/LoadingPage.module.css";
type LoadingPageProps = {
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  isOverlay?: boolean;
}

export function LoadingPage({
                              message = "Cargando...",
                              size = "medium",
                              fullScreen = true,
                              isOverlay = false
                            }: LoadingPageProps) {
  const containerClass = fullScreen
    ? `${styles.fullScreenContainer} ${isOverlay ? styles.overlay : ''}`
    : styles.container;

  return (
    <div className={containerClass}>
      <div className={styles.loadingContent}>
        <div className={`${styles.spinner} ${styles[size]}`}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}