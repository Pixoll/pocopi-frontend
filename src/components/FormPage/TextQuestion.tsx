import type { TextLong, TextShort } from "@/api";
import styles from "@/styles/FormPage/SelectOneQuestion.module.css";
import type { ChangeEvent } from "react";

type TextQuestionProps = {
  question: TextShort | TextLong;
  answer: string;
  onTextChange: (answer: string) => void;
};

export function TextQuestion({
  question,
  answer,
  onTextChange,
}: TextQuestionProps) {
  const props = {
    name: `question-${question.id}`,
    minLength: question.minLength,
    maxLength: question.maxLength,
    placeholder: question.placeholder,
    value: answer,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onTextChange(e.target.value),
  };

  return (
    <div>
      <label className={styles.questionText}>
        {question.text}
      </label>
      <div className={styles.optionsContainer}>
        {question.type === "text-short" ? <input {...props}/> : <textarea {...props}/>}
      </div>
    </div>
  );
}
