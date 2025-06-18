import { config } from "@fortawesome/fontawesome-svg-core";
import { FormQuestionType } from "@pocopi/config";
import { useState } from "react";

interface PreTestPageProps {
  onSubmit: (answers: (string | number)[]) => void;
}

export function PreTestPage({ onSubmit }: PreTestPageProps) {
  const { questions } = config.preTestForm!;
  const [answers, setAnswers] = useState<(string | number)[]>(
    questions.map(q =>
      q.type === FormQuestionType.SLIDER
        ? Math.floor(((q.min ?? 1) + (q.max ?? 1)) / 2)
        : ""
    )
  );

  const handleChange = (idx: number, value: string | number) => {
    setAnswers(ans => ans.map((a, i) => (i === idx ? value : a)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h2>Pre-Test</h2>
      {questions.map((question, idx) => {
        switch (question.type) {
          case FormQuestionType.SLIDER:
            return (
              <div key={idx} style={{ margin: "32px 0" }}>
                <label style={{ display: "block", marginBottom: 8 }}>{question.text}</label>
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  value={answers[idx] as number}
                  onChange={e => handleChange(idx, Number(e.target.value))}
                  style={{ width: "100%" }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${question.marks?.length ?? 0}, minmax(90px, 1fr))`,
                    fontSize: 13,
                    marginTop: 4,
                    width: "100%",
                    gap: 4,
                  }}
                >
                  {question.marks?.map((mark: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        textAlign: "center",
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                        padding: "0 2px",
                      }}
                    >
                      {mark}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 8, fontWeight: "bold", textAlign: "center" }}>
                  Respuesta seleccionada: {answers[idx]}
                </div>
              </div>
            );
          case FormQuestionType.SELECT_ONE:
            return (
              <div key={idx} style={{ margin: "32px 0" }}>
                <label style={{ display: "block", marginBottom: 8 }}>{question.text}</label>
                <select
                  value={answers[idx] as string}
                  onChange={e => handleChange(idx, e.target.value)}
                  style={{ width: 300 }}
                >
                  <option value="">Seleccione una opción</option>
                  {question.options?.map((opt: { text: string }, i: number) => (
                    <option key={i} value={opt.text}>{opt.text}</option>
                  ))}
                  {question.other && <option value="other">Otro</option>}
                </select>
              </div>
            );
          // Puedes agregar más tipos aquí si los necesitas
          default:
            return null;
        }
      })}
      <button type="submit">Enviar respuestas</button>
    </form>
  );
}