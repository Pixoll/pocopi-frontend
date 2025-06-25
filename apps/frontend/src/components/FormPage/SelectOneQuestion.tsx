import type { FormQuestionSelectOne } from "@pocopi/config";

type SelectOneQuestionProps = {
  question: FormQuestionSelectOne;
  answer: string;
  setAnswer: (value: string) => void;
};

export function SelectOneQuestion({ question, answer, setAnswer }: SelectOneQuestionProps) {
  return (
    <div style={{ margin: "32px 0" }}>
      <label style={{ display: "block", marginBottom: 8 }}>{question.text}</label>
      <select
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{ width: 300 }}
      >
        <option value="">Seleccione una opción</option>
        {question.options?.map((opt, i) => (
          <option key={i} value={opt.text ?? ""}>{opt.text ?? ""}</option>
        ))}
        {question.other && <option value="other">Otro</option>}
      </select>
    </div>
  );
}
