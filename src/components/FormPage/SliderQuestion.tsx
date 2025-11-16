import styles from "@/styles/FormPage/SliderQuestion.module.css";
import type {Slider} from "@/api";

type SliderQuestionProps = {
  question: Slider;
  answer: number;
  setAnswer: (value: number) => void;
};

export function SliderQuestion({ question, answer, setAnswer }: SliderQuestionProps) {
  const labels: Record<number, string> = {};
  const length = question.max - question.min + 1;
  const datalistId = `datalist-${question.text}`;

  for (const { number, label } of question.labels) {
    labels[number] = label;
  }

  return (
    <div>
      <label className={styles.questionText}>
        {question.text}
      </label>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min={question.min}
          max={question.max}
          step={question.step || 1}
          value={answer ?? question.min}
          onChange={(e) => setAnswer(Number(e.target.value))}
          onClick={(e) => setAnswer(Number((e.target as HTMLInputElement).value))}
          list={datalistId}
          className={[
            styles.slider,
            answer === undefined ? styles.unanswered : "",
          ].join(" ")}
          style={{ width: `${100 / (length + 1) * length}%` }}
        />
        <datalist
          id={datalistId}
          className={styles.labelsContainer}
        >
          {Array.from({ length }, (_, i) => (
            <option
              key={i}
              value={question.min + i}
              label={labels[question.min + i] ?? ""}
              className={styles.label}
            />
          ))}
        </datalist>
      </div>
    </div>
  );
}