import api, { type FormAnswerDto, type User } from "@/api";
import { SelectOneQuestion } from "@/components/FormPage/SelectOneQuestion";
import { SliderQuestion } from "@/components/FormPage/SliderQuestion";
import { Spinner } from "@/components/Spinner";
import styles from "@/styles/FormPage/FormPage.module.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  const title = type === "pre-test"
    ? config.t("preTest.title")
    : config.t("postTest.title");

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
      setError(config.t("form.youMustAnswerEverything"));
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
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
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

          <div className={styles.sendButtonContainer}>
            {error && <div>{error}</div>}

            <button type="submit" disabled={sending} className={styles.sendButton}>
              {sending
                ? <>
                  {config.t("form.sendingAnswers")}
                  <Spinner/>
                </>
                : <>
                  {config.t("form.sendAnswers")}
                  <FontAwesomeIcon icon={faArrowRight}/>
                </>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
