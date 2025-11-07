import React from 'react';
import styles from '@/styles/SavePopup.module.css';

type SavePopupProps = {
  status: 'loading' | 'success' | 'error' | null;
  message?: string;
  onClose?: () => void;
};

export const SavePopup: React.FC<SavePopupProps> = ({ status, message, onClose }) => {
  if (!status) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {status === 'loading' && (
          <>
            <div className={styles.spinner}></div>
            <p className={styles.message}>Guardando cambios...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.iconSuccess}>✓</div>
            <p className={styles.message}>{message || 'Cambios guardados exitosamente'}</p>
            <button onClick={onClose} className={styles.closeButton}>
              Cerrar
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.iconError}>✕</div>
            <p className={styles.message}>{message || 'Error al guardar los cambios'}</p>
            <button onClick={onClose} className={styles.closeButton}>
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );
};