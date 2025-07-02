import type { Answers } from "@/hooks/useTest";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/TestPage/PhaseSummaryModal.module.css";
import { config, type Protocol } from "@pocopi/config";

type PhaseSummaryModalProps = {
  protocol: Protocol;
  answers: Answers;
  phaseIndex: number;
  jumpToQuestion: (phaseId: number, questionId: number) => void;
  onContinue: () => void;
};

export function PhaseSummaryModal({
  protocol,
  answers,
  phaseIndex,
  jumpToQuestion,
  onContinue,
}: PhaseSummaryModalProps) {
  const { isDarkMode } = useTheme();

  const phasesStart = !protocol.allowPreviousPhase ? phaseIndex : 0;
  const phasesToShow = protocol.phases.slice(phasesStart, phaseIndex + 1);

  const title = !protocol.allowPreviousPhase
    ? config.t("summary.phaseSummary", `${phaseIndex + 1}`)
    : config.t("summary.testSummary");

  const continueText = phaseIndex < protocol.phases.length - 1
    ? config.t("summary.nextPhase")
    : config.t("summary.endTest");

  const onQuestionClick = (phaseIndex: number, questionIndex: number) => {
    if (protocol.allowPreviousQuestion) {
      jumpToQuestion(phasesStart + phaseIndex, questionIndex);
    }
  };

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
              <th>{config.t("summary.phase")}</th>
              <th>{config.t("summary.question")}</th>
              <th>{config.t("summary.status")}</th>
            </tr>
          </thead>
          <tbody>
            {phasesToShow.flatMap((phase, phaseIdx) => phase.questions.map((question, questionIdx) => (
              <tr key={`${phase.id}-${question.id}`}>
                <td>{phasesStart + phaseIdx + 1}</td>
                <td>
                  <button
                    className={[
                      styles.linkButton,
                      isDarkMode ? styles.linkButtonDark : styles.linkButtonLight,
                    ].join(" ")}
                    disabled={!protocol.allowPreviousQuestion}
                    onClick={() => onQuestionClick(phaseIdx, questionIdx)}
                  >
                    {questionIdx + 1}
                  </button>
                </td>
                <td>
                  {answers[phase.id][question.id] !== null
                    ? config.t("summary.answered")
                    : config.t("summary.notAnswered")
                  }
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
