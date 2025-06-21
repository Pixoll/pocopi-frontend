import styles from "@/styles/TestPage/PhaseSummaryModal.module.css";
import { useTheme } from "@/hooks/useTheme";

type PhaseSummaryModalProps = {
  questions: [number, number][];
  currentPhase: number;
  jumpToQuestion: (phaseId: number, questionId: number) => void;
  onContinue: () => void;
  onlyCurrentPhase: boolean;
  allowJump: boolean;
};

export function PhaseSummaryModal({
                                    questions,
                                    currentPhase,
                                    jumpToQuestion,
                                    onContinue,
                                    onlyCurrentPhase,
                                    allowJump,
                                  }: PhaseSummaryModalProps) {
  const { isDarkMode } = useTheme();
  
  const questionsToShow = questions.filter(([phaseIdx]) =>
    onlyCurrentPhase ? phaseIdx === currentPhase : phaseIdx <= currentPhase
  );
  
  const title = onlyCurrentPhase
    ? `Resumen de la Fase ${currentPhase + 1}`
    : "Resumen del Test";
  
  return (
    <div className={styles.modalWrapper}>
      <div
        className={`${styles.modal} ${
          isDarkMode ? styles.modalDark : styles.modalLight
        }`}
      >
        <h2 className={styles.title}>{title}</h2>
        
        <table className={styles.table}>
          <thead>
          <tr>
            <th>Pregunta</th>
            <th>Fase</th>
            <th>Estado</th>
          </tr>
          </thead>
          <tbody>
          {questionsToShow.map(([phaseIdx, questionIdx]) => (
            <tr key={`${phaseIdx}-${questionIdx}`}>
              <td>
                <button
                  className={styles.linkButton}
                  disabled={!allowJump}
                  onClick={() =>
                    allowJump && jumpToQuestion(phaseIdx, questionIdx)
                  }
                >
                  {questionIdx + 1}
                </button>
              </td>
              <td>{phaseIdx + 1}</td>
              <td>Respondida</td>
            </tr>
          ))}
          </tbody>
        </table>
        
        <button className={styles.continueBtn} onClick={onContinue}>
          Continuar a la siguiente fase
        </button>
      </div>
    </div>
  );
}
