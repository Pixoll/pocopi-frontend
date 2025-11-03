import type { Answers } from "@/hooks/useTest";
import { useTheme } from "@/hooks/useTheme";
import styles from "@/styles/TestPage/PhaseSummaryModal.module.css";
import {type TestProtocol, type TrimmedConfig} from "@/api";
import {t} from "@/utils/translations.ts";


type PhaseSummaryModalProps = {
  config: TrimmedConfig;
  protocol: TestProtocol;
  answers: Answers;
  phaseIndex: number;
  jumpToQuestion: (phaseId: number, questionId: number) => void;
  onContinue: () => void;
};

export function PhaseSummaryModal({
  config,
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
    ? t(config, "summary.phaseSummary", `${phaseIndex + 1}`)
    : t(config, "summary.testSummary");

  const continueText = phaseIndex < protocol.phases.length - 1
    ? t(config, "summary.nextPhase")
    : t(config, "summary.endTest");

  const onQuestionClick = (phaseIndex: number, questionIndex: number) => {
    if (protocol.allowPreviousQuestion) {
      jumpToQuestion(phasesStart + phaseIndex, questionIndex);
    }
  };

  return (
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
            {protocol.allowPreviousPhase && (
              <th>{t(config, "summary.phase")}</th>
            )}
            <th>{t(config, "summary.question")}</th>
            <th>{t(config, "summary.status")}</th>
          </tr>
        </thead>
        <tbody>
          {phasesToShow.flatMap((phase, phaseIdx) => phase.questions.map((question, questionIdx) => (
            <tr key={`${phase.id}-${question.id}`}>
              {protocol.allowPreviousPhase && (
                <td>{phasesStart + phaseIdx + 1}</td>
              )}
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
                  ? t(config, "summary.answered")
                  : t(config, "summary.notAnswered")
                }
              </td>
            </tr>
          )))}
        </tbody>
      </table>

      <button
        className={[
          styles.continueButton,
          isDarkMode ? styles.continueButtonDark : styles.continueButtonLight,
        ].join(" ")}
        onClick={onContinue}
      >
        {continueText}
      </button>
    </div>
  );
}
