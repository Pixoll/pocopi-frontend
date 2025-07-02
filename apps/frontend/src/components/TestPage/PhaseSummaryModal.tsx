import type { Answers } from "@/hooks/useTest";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/TestPage/PhaseSummaryModal.module.css";
import type { Protocol } from "@pocopi/config";

type PhaseSummaryModalProps = {
  protocol: Protocol;
  answers: Answers;
  currentPhase: number;
  jumpToQuestion: (phaseId: number, questionId: number) => void;
  onContinue: () => void;
};

export function PhaseSummaryModal({
  protocol,
  answers,
  currentPhase,
  jumpToQuestion,
  onContinue,
}: PhaseSummaryModalProps) {
  const { isDarkMode } = useTheme();

  const phasesStart = !protocol.allowPreviousPhase ? currentPhase : 0;
  const phasesToShow = protocol.phases.slice(phasesStart, currentPhase + 1);

  const title = !protocol.allowPreviousPhase
    ? `Resumen de la Fase ${currentPhase + 1}`
    : "Resumen del Test";

  const isLastPhase = currentPhase === protocol.phases.length - 1;
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
              <th>Fase</th>
              <th>Pregunta</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {phasesToShow.flatMap((phase, phaseIdx) => phase.questions.map((question, questionIdx) => (
              <tr key={`${phase.id}-${question.id}`}>
                <td>{phaseIdx + 1}</td>
                <td>
                  <button
                    className={[
                      styles.linkButton,
                      isDarkMode ? styles.linkButtonDark : styles.linkButtonLight,
                    ].join(" ")}
                    disabled={!protocol.allowPreviousQuestion}
                    onClick={() => protocol.allowPreviousQuestion && jumpToQuestion(phaseIdx, questionIdx)}
                  >
                    {questionIdx + 1}
                  </button>
                </td>
                <td>
                  {answers[phase.id][question.id] !== null
                    ? "Respondida"
                    : "Sin responder"}
                </td>
              </tr>
            )))}
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
