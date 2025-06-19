import styles from "@/styles/TestPage/PhaseSummaryModal.module.css";

type PhaseSummaryModalProps = {
  questions: { id: string; answered: boolean }[];
  onSelectQuestion: (index: number) => void;
  onContinue: () => void;
};

export function PhaseSummaryModal({ questions, onSelectQuestion, onContinue }: PhaseSummaryModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Resumen de la Fase</h2>
        <div className={styles.questionsGrid}>
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(index)}
              className={`${styles.questionButton} ${q.answered ? styles.answered : styles.unanswered}`}
            >
              Pregunta {index + 1}
            </button>
          ))}
        </div>
        <button className={styles.continueButton} onClick={onContinue}>
          Continuar a la siguiente fase
        </button>
      </div>
    </div>
  );
}
