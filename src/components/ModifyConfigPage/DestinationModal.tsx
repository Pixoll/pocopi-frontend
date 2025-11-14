import { useState } from 'react';
import styles from '@/styles/ModifyConfigPage/DestinationModal.module.css';
import type { EditablePatchGroup } from '@/utils/imageCollector.ts';

type DestinationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (groupIndex: number, phaseIndex?: number) => void;
  groups: EditablePatchGroup[];
  title: string;
  needsPhaseSelection?: boolean;
};

export function DestinationModal({
                                   isOpen,
                                   onClose,
                                   onConfirm,
                                   groups,
                                   title,
                                   needsPhaseSelection = false
                                 }: DestinationModalProps) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | undefined>(undefined);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (needsPhaseSelection && selectedPhaseIndex === undefined) {
      alert('Por favor selecciona una fase de destino');
      return;
    }
    onConfirm(selectedGroupIndex, selectedPhaseIndex);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Seleccionar Grupo:</label>
            <select
              value={selectedGroupIndex}
              onChange={(e) => {
                setSelectedGroupIndex(parseInt(e.target.value));
                setSelectedPhaseIndex(undefined);
              }}
              className={styles.select}
            >
              {groups.map((group, index) => (
                <option key={index} value={index}>
                  {group.label || `Grupo ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          {needsPhaseSelection && groups[selectedGroupIndex]?.phases?.length > 0 && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Seleccionar Fase:</label>
              <select
                value={selectedPhaseIndex ?? ''}
                onChange={(e) => setSelectedPhaseIndex(e.target.value ? parseInt(e.target.value) : undefined)}
                className={styles.select}
              >
                <option value="">-- Selecciona una fase --</option>
                {groups[selectedGroupIndex].phases.map((phase, index) => (
                  <option key={index} value={index}>
                    Fase {index + 1} ({phase.questions?.length || 0} preguntas)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={handleConfirm} className={styles.confirmButton}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
