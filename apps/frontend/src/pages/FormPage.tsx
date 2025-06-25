import api, { type User } from "@/api";
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
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [_sending, setSending] = useState<boolean>(false);
  const [_error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questions.length === 0) {
      goToNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = type === "pre-test" ? "Pre-Test Form" : "Post-Test Form";

  const handleChange = (index: number) => {
    return (value: string) => {
      answers[index] = value;
      setAnswers([...answers]);
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const result = await api.savePostTest({
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
          case FormQuestionType.SLIDER:
            return <SliderQuestion
              key={idx}
              question={question}
              answer={answers[idx]}
              setAnswer={handleChange(idx)}
            />;

          case FormQuestionType.SELECT_ONE:
            return <SelectOneQuestion
              key={idx}
              question={question}
              answer={answers[idx]}
              setAnswer={handleChange(idx)}
            />;

          default:
            return null;
        }
      })}

      <button type="submit">Enviar respuestas</button>
    </form>
  );
}
