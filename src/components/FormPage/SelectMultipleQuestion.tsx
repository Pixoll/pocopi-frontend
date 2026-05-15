import type { NewFormAnswer, SelectMultiple, TrimmedConfig } from "@/api";
import styles from "@/styles/FormPage/SelectOneQuestion.module.css";
import { t } from "@/utils/translations.ts";
import { useState } from "react";

type SelectMultipleQuestionProps = {
  config: TrimmedConfig;
  question: SelectMultiple;
  answers: NewFormAnswer[];
  onOptionChange: (optionId: number) => void;
  onOtherChange: (otherText: string) => void;
};

export function SelectMultipleQuestion({
  config,
  question,
  answers,
  onOptionChange,
  onOtherChange,
}: SelectMultipleQuestionProps) {
  const [otherText, setOtherText] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const handleOptionSelect = (selectedOptionId: number) => {
    onOptionChange(selectedOptionId);
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    onOtherChange(text);
  };

  return (
    <div>
      <label className={styles.questionText}>
        {question.text}
      </label>
      <div className={styles.optionsContainer}>
        {question.options?.map(opt => (
          <label key={opt.id} className={styles.optionText}>
            <input
              type="checkbox"
              name={`question-${question.id}`}
              value={opt.id}
              checked={answers.some(a => a.optionId === opt.id)}
              onChange={() => handleOptionSelect(opt.id)}
            />
            <span>{opt.text}</span>
          </label>
        ))}
        {question.other && (
          <label className={styles.optionText}>
            <input
              type="checkbox"
              name={`question-${question.id}`}
              value="other"
              checked={isOtherSelected}
              onChange={() => setIsOtherSelected(true)}
            />
            <span>Otro:</span>
            <input
              type="text"
              name={`question-${question.id}-other-text`}
              placeholder={t(config, "form.otherPlaceholder")}
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
