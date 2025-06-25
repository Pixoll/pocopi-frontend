import api, { type FormAnswerDto, type User } from "@/api";
import { SelectMultipleQuestion } from "@/components/FormPage/SelectMultipleQuestion";
import { SelectOneQuestion } from "@/components/FormPage/SelectOneQuestion";
import { SliderQuestion } from "@/components/FormPage/SliderQuestion";
import { config, FormQuestionType } from "@pocopi/config";
import { type FormEvent, useEffect, useState } from "react";

type FormPageProps = {
  type: "pre-test" | "post-test";
  userData: User;
  goToNextPage: () => void;
};

export function FormPage({
  type,
  userData,
  goToNextPage,
}: FormPageProps) {
  const form = type === "pre-test" ? config.preTestForm : config.postTestForm;
  const questions = form?.questions ?? [];
  const [answers, setAnswers] = useState<FormAnswerDto[]>(Array.from({ length: questions.length }, (_, i) => ({
    questionId: i + 1,
    answers: [""],
  })));
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questions.length === 0) {
      goToNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = type === "pre-test" ? "Pre-Test Form" : "Post-Test Form";

  const handleChange = (questionIndex: number, values: string[]) => {
    answers[questionIndex] = {
      ...answers[questionIndex],
      answers: values,
    };
    setAnswers([...answers]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    if (answers.some(a => a.answers.some(b => b.length === 0))) {
      setSending(false);
      setError("Debes responder todas las preguntas.");
      return;
    }

    try {
      const endpoint = type === "pre-test" ? api.savePreTest : api.savePostTest;

      const result = await endpoint({
        body: {
          userId: userData.id,
          answers,
        }
      });

      if (result.error) {
        setError(result.error.message);
        console.error(result.error);
      } else {
        goToNextPage();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : `${error}`);
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h2>{title}</h2>

      {questions.map((question, idx) => {
        switch (question.type) {
          case FormQuestionType.SELECT_ONE:
            return <SelectOneQuestion
              key={idx}
              question={question}
              answer={answers[idx].answers[0]}
              setAnswer={(value) => handleChange(idx, [value])}
            />;

          case FormQuestionType.SLIDER:
            return <SliderQuestion
              key={idx}
              question={question}
              answer={answers[idx].answers[0]}
              setAnswer={(value) => handleChange(idx, [value])}
            />;

          default:
            return null;
        }
      })}

      {error && <div>{error}</div>}

      <button type="submit" disabled={sending}>
        {sending ? "Enviando respuestas..." : "Enviar respuestas"}
      </button>
    </form>
  );
}
