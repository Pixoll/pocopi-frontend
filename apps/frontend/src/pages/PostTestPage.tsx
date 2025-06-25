import api, { type User } from "@/api";
import { config, FormQuestionType } from "@pocopi/config";
import { type FormEvent, useState } from "react";

interface PostTestPageProps {
  userData: User;
  goToNextPage: () => void;
}

export function PostTestPage({ userData, goToNextPage }: PostTestPageProps) {
  const questions = config.postTestForm?.questions ?? [];
  const [answers, setAnswers] = useState<string[]>(
    questions.map((q) =>
      q.type === FormQuestionType.SLIDER
        ? Math.floor(((q.min ?? 1) + (q.max ?? 1)) / 2).toString()
        : ""
    )
  );

  const handleChange = (idx: number, value: string) => {
    setAnswers((ans) => ans.map((a, i) => (i === idx ? value : a)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await api.savePostTest({
        body: {
          userId: userData.id,
          answers,
        }
      });

      if (result.error) {
        console.error(result.error);
      } else {
        goToNextPage();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}
    >
      <h2>Post-Test</h2>
      {questions.map((question, idx) => {
        switch (question.type) {
          case FormQuestionType.SLIDER: {
            const labelKeys = Object.keys(question.labels || {})
              .map(Number)
              .sort((a, b) => a - b);
            return (
              <div key={idx} style={{ margin: "32px 0" }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  {question.text}
                </label>
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  step={question.step || 1}
                  value={answers[idx]}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  style={{ width: "100%" }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${labelKeys.length}, minmax(60px, 1fr))`,
                    fontSize: 13,
                    marginTop: 4,
                    width: "100%",
                    gap: 4,
                  }}
                >
                  {labelKeys.map((key) => (
                    <span
                      key={key}
                      style={{
                        textAlign: "center",
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                        padding: "0 2px",
                      }}
                    >
                      {String(question.labels[key].label)}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Respuesta seleccionada: {answers[idx]}
                </div>
              </div>
            );
          }
          case FormQuestionType.SELECT_ONE:
            return (
              <div key={idx} style={{ margin: "32px 0" }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  {question.text}
                </label>
                <select
                  value={answers[idx] as string}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  style={{ width: 300 }}
                >
                  <option value="">Seleccione una opción</option>
                  {question.options?.map((opt, i) => (
                    <option key={i} value={opt.text ?? ""}>
                      {opt.text ?? ""}
                    </option>
                  ))}
                  {question.other && <option value="other">Otro</option>}
                </select>
              </div>
            );
          default:
            return null;
        }
      })}
      <button type="submit">Enviar respuestas</button>
    </form>
  );
}
