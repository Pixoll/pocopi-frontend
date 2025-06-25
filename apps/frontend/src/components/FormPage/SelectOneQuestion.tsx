import styles from "@/styles/FormPage/SelectOneQuestion.module.css";
import type { FormQuestionSelectOne } from "@pocopi/config";
import { useState } from "react";

type SelectOneQuestionProps = {
  question: FormQuestionSelectOne;
  answer: string;
  setAnswer: (value: string) => void;
};

export function SelectOneQuestion({ question, answer, setAnswer }: SelectOneQuestionProps) {
  const [otherText, setOtherText] = useState("");

  const handleOptionChange = (value: string) => {
    setAnswer(value);
    if (value !== "other") {
      setOtherText("");
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    setAnswer(text);
  };

  return (
    <div>
      <label className={styles.questionText}>
        {question.text}
      </label>
      <div className={styles.optionsContainer}>
        {question.options?.map((opt, i) => (
          <label key={i} className={styles.optionText}>
            <input
              type="radio"
              name={`question-${question.text}-${opt.text}`}
              value={opt.text}
              checked={answer === opt.text}
              onChange={(e) => handleOptionChange(e.target.value)}
            />
            <span>{opt.text}</span>
          </label>
        ))}
        {question.other && (
          <label className={styles.optionText}>
            <input
              type="radio"
              name={`question-${question.text}-other`}
              value="other"
              checked={answer !== "" && !question.options.some(opt => opt.text === answer)}
              onChange={() => handleOptionChange("other")}
            />
            <span>Otro:</span>
            <input
              type="text"
              name={`question-${question.text}-other-text`}
              placeholder="Especifique..."
              value={otherText}
              onChange={(e) => handleOtherTextChange(e.target.value)}
              className={styles.otherField}
            />
          </label>
        )}
      </div>
    </div>
  );
}
