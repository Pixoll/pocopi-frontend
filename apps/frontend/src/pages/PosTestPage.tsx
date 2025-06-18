import { useState } from "react";

interface PostTestPageProps {
  onSubmit: (answers: number[]) => void;
}

type SliderQuestion = {
  label: string;
  min: number;
  max: number;
  marks: string[];
};

const postTestQuestions: SliderQuestion[] = [
  {
    label: "Los contratiempos me desaniman",
    min: 1,
    max: 4,
    marks: [
      "Totalmente en desacuerdo",
      "Algo en desacuerdo",
      "Algo de acuerdo",
      "Totalmente de acuerdo",
    ],
  },
  {
    label: "Soy muy trabajador/a",
    min: 1,
    max: 4,
    marks: [
      "Totalmente en desacuerdo",
      "Algo en desacuerdo",
      "Algo de acuerdo",
      "Totalmente de acuerdo",
    ],
  },
  {
    label: "Termino siempre todo lo que empiezo",
    min: 1,
    max: 4,
    marks: [
      "Totalmente en desacuerdo",
      "Algo en desacuerdo",
      "Algo de acuerdo",
      "Totalmente de acuerdo",
    ],
  },
  {
    label: "Soy diligente (es decir, cuidadoso, activo y que ejecuta con celo y exactitud lo que esta a su cargo)",
    min: 1,
    max: 4,
    marks: [
      "Totalmente en desacuerdo",
      "Algo en desacuerdo",
      "Algo de acuerdo",
      "Totalmente de acuerdo",
    ],
  },
  {
    label: "Hago un plan antes de comenzar a hacer un trabajo escrito. Pienso lo que voy a hacer y lo que necesito para conseguirlo",
    min: 1,
    max: 5,
    marks: [
      "Totalmente en desacuerdo",
      "Algo en desacuerdo",
      "Ni acuerdo ni en desacuerdo",
      "Algo de acuerdo",
      "Totalmente de acuerdo",
    ],
  },
  {
    label: "Cuando estudio, intento comprender las materias, tomar apuntes, hacer resúmenes, resolver ejercicios, hacer preguntas sobre los contenidos.",
    min: 1,
    max: 5,
    marks: [
      "Totalmente en desacuerdo",
      "Algo en desacuerdo",
      "Ni acuerdo ni en desacuerdo",
      "Algo de acuerdo",
      "Totalmente de acuerdo",
    ],
  },
  {
    label: "Después de terminar un examen parcial / final, lo reviso mentalmente para saber dónde tuve los aciertos y errores y, hacerme una idea de la nota que voy a tener",
    min: 1,
    max: 5,
    marks: [
      "Totalmente en desacuerdo",
      "Algo en desacuerdo",
      "Ni acuerdo ni en desacuerdo",
      "Algo de acuerdo",
      "Totalmente de acuerdo",
    ],
  },
  {
    label: "Depende de mi o no que tan bien me va en una actividad académica",
    min: 1,
    max: 7,
    marks: [
      "Totalmente en desacuerdo",
      "2",
      "3",
      "4",
      "5",
      "6",
      "Totalmente de acuerdo",
    ],
  },
  {
    label: "Si quiero puedo completar todas las tareas de las actividades académicas",
    min: 1,
    max: 7,
    marks: [
      "Totalmente en desacuerdo",
      "2",
      "3",
      "4",
      "5",
      "6",
      "Totalmente de acuerdo",
    ],
  },
  {
    label: "Depende de mi si mantengo al día mis actividades académicas",
    min: 1,
    max: 7,
    marks: [
      "Totalmente en desacuerdo",
      "2",
      "3",
      "4",
      "5",
      "6",
      "Totalmente de acuerdo",
    ],
  },
];

export function PostTestPage({ onSubmit }: PostTestPageProps) {
  const [answers, setAnswers] = useState(
    postTestQuestions.map((q) => Math.floor((q.max + q.min) / 2))
  );

  const handleSlider = (idx: number, value: number) => {
    setAnswers((ans) => ans.map((a, i) => (i === idx ? value : a)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}
    >
      <h2>Post-Test</h2>
      {postTestQuestions.map((q, idx) => (
        <div key={idx} style={{ margin: "32px 0" }}>
          <label style={{ display: "block", marginBottom: 8 }}>{q.label}</label>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <input
              type="range"
              min={q.min}
              max={q.max}
              value={answers[idx]}
              onChange={(e) => handleSlider(idx, Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${q.marks.length}, minmax(90px, 1fr))`,
                fontSize: 13,
                marginTop: 4,
                width: "100%",
                gap: 4,
              }}
            >
              {q.marks.map((mark, i) => (
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
          </div>
          <div style={{ marginTop: 8, fontWeight: "bold", textAlign: "center" }}>
            Respuesta seleccionada: {answers[idx]}
          </div>
        </div>
      ))}
      <button type="submit">Enviar respuestas</button>
    </form>
  );
}