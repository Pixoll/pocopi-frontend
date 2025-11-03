import styles from "@/styles/FormPage/SelectOneQuestion.module.css";
import { useState, useEffect } from "react";
import type {TrimmedConfig, SelectOne} from "@/api";
import {t} from "@/utils/translations.ts";

type SelectOneQuestionProps = {
  config: TrimmedConfig;
  question: SelectOne;
  answer: string;
  optionId: number;
  onOptionChange: (optionId: number, optionText: string) => void;
  onOtherChange: (otherText: string) => void;
};

export function SelectOneQuestion({
                                    config,
                                    question,
                                    answer,
                                    optionId,
                                    onOptionChange,
                                    onOtherChange
                                  }: SelectOneQuestionProps) {
  const [otherText, setOtherText] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  useEffect(() => {
    const isAnswerInOptions = question.options.some(opt => opt.text === answer);
    if (!isAnswerInOptions && answer !== "") {
      setIsOtherSelected(true);
      setOtherText(answer);
    } else {
      setIsOtherSelected(false);
      setOtherText("");
    }
  }, [answer, question.options]);

  const handleOptionSelect = (selectedOptionId: number, selectedOptionText: string) => {
    setIsOtherSelected(false);
    setOtherText("");
    onOptionChange(selectedOptionId, selectedOptionText);
  };

  const handleOtherSelect = () => {
    setIsOtherSelected(true);
    if (otherText) {
      onOtherChange(otherText);
    }
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
        {question.options?.map((opt, i) => (
          <label key={i} className={styles.optionText}>
            <input
              type="radio"
              name={`question-${question.id}`}
              value={opt.id}
              checked={optionId === opt.id && !isOtherSelected}
              onChange={() => handleOptionSelect(opt.id, opt.text ?? "")}
            />
            <span>{opt.text}</span>
          </label>
        ))}
        {question.other && (
          <label className={styles.optionText}>
            <input
              type="radio"
              name={`question-${question.id}`}
              value="other"
              checked={isOtherSelected}
              onChange={handleOtherSelect}
            />
            <span>Otro:</span>
            <input
              type="text"
              name={`question-${question.id}-other-text`}
              placeholder={t(config, "form.otherPlaceholder")}
              value={otherText}
              onChange={(e) => handleOtherTextChange(e.target.value)}
              onFocus={handleOtherSelect}
              className={styles.otherField}
            />
          </label>
        )}
      </div>
    </div>
  );
}