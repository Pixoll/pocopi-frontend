import styles from "@/styles/TestPage/PhaseSummaryModal.module.css";

type PhaseSummaryModalProps = {
  questions: [number, number][];
  answeredQuestions: [number, number][];
  currentPhase: number;
  jumpToQuestion: (phaseId: number, questionId: number) => void;
  onContinue: () => void;
  onlyCurrentPhase: boolean;
  allowJump: boolean;
  phasesCount?: number; // Añadido para saber si es la última fase
  isDarkMode: boolean;  // <-- Recibe el modo oscuro como prop
};

export function PhaseSummaryModal({
                                    questions,
                                    answeredQuestions,
                                    currentPhase,
                                    jumpToQuestion,
                                    onContinue,
                                    onlyCurrentPhase,
                                    allowJump,
                                    phasesCount,
                                    isDarkMode,
                                  }: PhaseSummaryModalProps) {
  const questionsToShow = questions.filter(([phaseIdx]) =>
    onlyCurrentPhase ? phaseIdx === currentPhase : phaseIdx <= currentPhase
  );
  
  const title = onlyCurrentPhase
    ? `Resumen de la Fase ${currentPhase + 1}`
    : "Resumen del Test";
  
  const isAnswered = (phaseIdx: number, questionIdx: number) =>
    answeredQuestions.some(
      ([p, q]) => p === phaseIdx && q === questionIdx
    );
  
  const isLastPhase = phasesCount !== undefined && currentPhase === phasesCount - 1;
  const continueText = isLastPhase
    ? "Terminar test"
    : "Continuar a la siguiente fase";
  
  return (
    <div className={styles.modalWrapper}>
      <div
        className={[
          styles.modal,
          isDarkMode ? styles.modalDark : styles.modalLight,
        ].join(" ")}
      >
        <h2 className={styles.title}>{title}</h2>
        
        <table
          className={[
            styles.table,
            isDarkMode ? styles.tableDark : styles.tableLight,
          ].join(" ")}
        >
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
                  className={[
                    styles.linkButton,
                    isDarkMode ? styles.linkButtonDark : styles.linkButtonLight,
                  ].join(" ")}
                  disabled={!allowJump}
                  onClick={() =>
                    allowJump && jumpToQuestion(phaseIdx, questionIdx)
                  }
                >
                  {questionIdx + 1}
                </button>
              </td>
              <td>{phaseIdx + 1}</td>
              <td>
                {isAnswered(phaseIdx, questionIdx)
                  ? "Respondida"
                  : "Sin responder"}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        
        <button
          className={[
            styles.continueBtn,
            isDarkMode ? styles.continueBtnDark : styles.continueBtnLight,
          ].join(" ")}
          onClick={onContinue}
        >
          {continueText}
        </button>
      </div>
    </div>
  );
}
