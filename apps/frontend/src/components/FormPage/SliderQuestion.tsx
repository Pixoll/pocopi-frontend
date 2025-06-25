import type { FormQuestionSlider } from "@pocopi/config";

type SliderQuestionProps = {
  question: FormQuestionSlider;
  answer: string;
  setAnswer: (value: string) => void;
};

export function SliderQuestion({ question, answer, setAnswer }: SliderQuestionProps) {
  const labels: Record<number, string> = {};
  const length = question.max - question.min + 1;

  for (const { number, label } of question.labels) {
    labels[number] = label;
  }

  return (
    <div style={{ margin: "32px 0" }}>
      <label style={{ display: "block", marginBottom: 8 }}>
        {question.text}
      </label>
      <input
        type="range"
        min={question.min}
        max={question.max}
        step={question.step || 1}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{ width: "100%" }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${length}, minmax(60px, 1fr))`,
          fontSize: 13,
          marginTop: 4,
          width: "100%",
          gap: 4,
        }}
      >
        {Array.from({ length }, (_, i) => (
          <span
            style={{
              textAlign: "center",
              whiteSpace: "pre-line",
              wordBreak: "break-word",
              padding: "0 2px",
            }}
          >
            {labels[question.min + i] ?? ""}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 8, fontWeight: "bold", textAlign: "center" }}>
        Respuesta seleccionada: {answer}
      </div>
    </div>
  );
}
