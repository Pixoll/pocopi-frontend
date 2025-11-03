import { faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/ErrorDisplay.module.css";
import type { ApiHttpError } from "@/api";
import { useEffect } from "react";

type ErrorDisplayProps = {
  error: string | ApiHttpError | Error | unknown;
  onClose?: () => void;
  className?: string;
};

export function ErrorDisplay({ error, onClose, className }: ErrorDisplayProps) {
  useEffect(() => {
    if (!error) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [error, onClose]);

  useEffect(() => {
    if (!error) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [error]);
  if (!error) return null;

  const renderErrorContent = () => {
    if (typeof error === "string") {
      return <p className={styles.message}>{error}</p>;
    }

    if (error instanceof Error) {
      return <p className={styles.message}>{error.message}</p>;
    }

    if (typeof error === "object" && error !== null && "code" in error) {
      const apiError = error as ApiHttpError;

      return (
        <>
          {apiError.code && (
            <p className={styles.code}>Error {apiError.code}</p>
          )}

          {apiError.message && (
            <p className={styles.message}>{apiError.message}</p>
          )}

          {apiError.errors && apiError.errors.length > 0 && (
            <div className={styles.errorsList}>
              <ul>
                {apiError.errors.map((fieldError, idx) => (
                  <li key={idx}>
                    <strong>{fieldError.field}:</strong> {fieldError.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      );
    }

    return <p className={styles.message}>{String(error)}</p>;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${className || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={faCircleExclamation} />
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Cerrar error"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>

        <div className={styles.modalContent}>
          {renderErrorContent()}
        </div>

        {onClose && (
          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButtonPrimary}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}