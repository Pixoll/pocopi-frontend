import api, {
  type Config,
  type NewFormAnswer, type SelectOne, type Slider
} from "@/api";
import { SelectOneQuestion } from "@/components/FormPage/SelectOneQuestion";
import { SliderQuestion } from "@/components/FormPage/SliderQuestion";
import { Spinner } from "@/components/Spinner";
import styles from "@/styles/FormPage/FormPage.module.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FormEvent, useEffect, useState } from "react";
import {t} from "@/utils/translations.ts";

type FormPageProps = {
  config: Config;
  type: "pre-test" | "post-test";
  username: string;
  goToNextPage: () => void;
};

export function FormPage({
  config,
  type,
  username,
  goToNextPage,
}: FormPageProps) {
  const form = type === "pre-test" ? config.preTestForm : config.postTestForm;
  const questions = form?.questions ?? [];

  const [answers, setAnswers] = useState<NewFormAnswer[]>(
    Array.from({ length: questions.length }, (_, i) => ({
      questionId: questions[i].id,
      optionId: -1,
      value: 0,
      answer: "",
    }))
  );

  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questions.length === 0) {
      goToNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = type === "pre-test"
    ? t(config, "preTest.title")
    : t(config, "postTest.title");

  const handleChange = (questionIndex: number, value: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = {
        ...newAnswers[questionIndex],
        answer: value,
      };
      return newAnswers;
    });
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    if (answers.some(a => a.answer.length === 0)) {
      setSending(false);
      setError(t(config, "form.youMustAnswerEverything"));
      return;
    }

    try {
      const result = await api.submitFormAnswers({
        body: {
          username: username,
          formId: form.id,
          answers: answers,
        }
      });

      if (result.error) {
        setError(result.error.toString());
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
              case "select-multiple":
              case "select-one":
                return (
                  <SelectOneQuestion
                    key={question.id}
                    config={config}
                    question={question as SelectOne}
                    answer={answers[idx].answer}
                    setAnswer={(value) => handleChange(idx, value)}
                  />
                );

              case "slider":
                return (
                  <SliderQuestion
                    key={question.id}
                    question={question as Slider}
                    answer={answers[idx].answer}
                    setAnswer={(value) => handleChange(idx, value)}
                  />
                );

              case "text-short":
              case "text-long":
              default:
                return null;
            }
          })}


          <div className={styles.sendButtonContainer}>
            {error && <div>{error}</div>}

            <button type="submit" disabled={sending} className={styles.sendButton}>
              {sending
                ? <>
                  {t(config, "form.sendingAnswers")}
                  <Spinner/>
                </>
                : <>
                  {t(config, "form.sendAnswers")}
                  <FontAwesomeIcon icon={faArrowRight}/>
                </>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
