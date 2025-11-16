import styles from '@/styles/ConfirmModal.module.css';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export function ConfirmModal({
                               isOpen,
                               onClose,
                               onConfirm,
                               title,
                               message
                             }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
