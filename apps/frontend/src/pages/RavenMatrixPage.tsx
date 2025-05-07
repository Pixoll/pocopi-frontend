import { Group } from "@pocopi/config";
import { useState } from "react";
import styles from "./RavenMatrixPage.module.css";

type RavenMatrixPageProps = {
  group: Group;
  goToNextPage: () => void;
};

export function RavenMatrixPage({ group, goToNextPage }: RavenMatrixPageProps) {
  const [phase, setPhase] = useState<number>(0);
  const [question, setQuestion] = useState<number>(0);
  const [selected, setSelected] = useState<string>("");

  const { phases } = group.protocol;
  const { questions } = phases[phase];
  const { image, options: tempOptions } = questions[question];

  const options = tempOptions.map(option => {
    const base64 = option.src.split(";")[1].slice(7);
    const half = Math.round(base64.length / 2);
    const id = base64.substring(half - 10, half + 10);

    return { id, ...option };
  });

  const optionsColumns = Math.ceil(options.length / 2);
  const isOptionsOdd = options.length % 2 === 1;

  const handlePreviousPhaseClick = () => {
    setQuestion(0);
    setPhase(phase - 1);
  };

  const handleNextPhaseClick = () => {
    if (phase < phases.length - 1) {
      setQuestion(0);
      setPhase(phase + 1);
      return;
    }

    goToNextPage();
  };

  const handlePreviousQuestionClick = () => {
    if (question <= 0) {
      handlePreviousPhaseClick();
      return;
    }

    setQuestion(question - 1);
  };

  const handleNextQuestionClick = () => {
    if (question < questions.length - 1) {
      setQuestion(question + 1);
      return;
    }

    handleNextPhaseClick();
  };

  const handleRavenOptionClick = (id: string) => {
    return () => setSelected(v => v === id ? "" : id);
  };

  return <div className={styles.ravenMatrixPage}>
    <div className={styles.ravenMatrixContainer} draggable={false}>
      <img className={styles.ravenMatrix} src={image.src} alt={image.alt} draggable={false}/>
      <div
        className={styles.ravenOptionsContainer}
        draggable={false}
        style={{ gridTemplateColumns: `repeat(${optionsColumns}, ${100 / optionsColumns}%)` }}
      >
        {options.map((option, i) => (
          <img
            className={[
              styles.ravenOption,
              isOptionsOdd && i % 2 === 1 ? styles.oddRavenOption : "",
              option.id === selected ? styles.selectedRavenOption : "",
            ].join(" ")}
            key={option.id}
            src={option.src}
            alt={option.alt}
            onClick={handleRavenOptionClick(option.id)}
            draggable={false}
          />
        ))}
      </div>
    </div>
    <div className={styles.phaseButtonsRow}>
      <button onClick={handlePreviousPhaseClick} disabled={phase === 0}>
        Previous phase
      </button>
      <button onClick={handleNextPhaseClick} disabled={phase >= phases.length - 1}>
        Next phase
      </button>
    </div>
    <div className={styles.testButtonsRow}>
      <button onClick={handlePreviousQuestionClick} disabled={question === 0 && phase === 0}>
        Previous test
      </button>
      <button onClick={handleNextQuestionClick}>
        Next test
      </button>
    </div>
  </div>;
}
