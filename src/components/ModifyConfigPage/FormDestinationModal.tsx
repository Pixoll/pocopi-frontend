import styles from '@/styles/ModifyConfigPage/DestinationModal.module.css';
import type { EditablePatchFormQuestion } from "@/utils/imageCollector.ts";

type FormDestinationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetForm: 'preTestForm' | 'postTestForm') => void;
  title: string;
  currentForm: 'preTestForm' | 'postTestForm';
  questionToPaste: EditablePatchFormQuestion | null;
};

export function FormDestinationModal({
                                       isOpen,
                                       onClose,
                                       onConfirm,
                                       title,
                                       currentForm,
                                       questionToPaste
                                     }: FormDestinationModalProps) {
  if (!isOpen || !questionToPaste) return null;

  const targetForm: 'preTestForm' | 'postTestForm' =
    currentForm === 'preTestForm' ? 'postTestForm' : 'preTestForm';
  const targetFormLabel = targetForm === 'preTestForm' ? 'Pre-Test' : 'Post-Test';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.message}>
            ¿Deseas copiar esta pregunta al formulario {targetFormLabel}?
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={() => onConfirm(targetForm)} className={styles.confirmButton}>
            Copiar a {targetFormLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
