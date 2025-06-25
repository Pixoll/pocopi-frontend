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
    <div style={{ margin: "32px 0" }}>
      <label style={{ display: "block", marginBottom: 16, fontWeight: "bold" }}>
        {question.text}
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {question.options?.map((opt, i) => (
          <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px", width: "fit-content" }}>
            <input
              type="radio"
              name={`question-${question.text}`}
              value={opt.text ?? ""}
              checked={answer === (opt.text ?? "")}
              onChange={(e) => handleOptionChange(e.target.value)}
            />
            <span>{opt.text ?? ""}</span>
          </label>
        ))}
        {question.other && (
          <label style={{ display: "flex", alignItems: "center", gap: "8px", width: "fit-content" }}>
            <input
              type="radio"
              name={`question-${question.text}`}
              value="other"
              checked={answer !== "" && !question.options?.some(opt => opt.text === answer)}
              onChange={() => handleOptionChange("other")}
            />
            <span>Otro:</span>
            <input
              type="text"
              value={otherText}
              onChange={(e) => handleOtherTextChange(e.target.value)}
              placeholder="Especifique..."
              style={{
                marginLeft: "8px",
                padding: "4px 8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "200px"
              }}
              disabled={answer !== "" && question.options?.some(opt => opt.text === answer)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
