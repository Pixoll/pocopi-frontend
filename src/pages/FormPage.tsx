import api, {
  type ApiHttpError,
  type NewFormAnswer,
  type SelectOne,
  type Slider,
  type TrimmedConfig,
  type User, type UserTestAttempt
} from "@/api";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { SelectOneQuestion } from "@/components/FormPage/SelectOneQuestion";
import { SliderQuestion } from "@/components/FormPage/SliderQuestion";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/FormPage/FormPage.module.css";
import { t } from "@/utils/translations";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FormEvent, useEffect, useState } from "react";

type FormPageProps = {
  config: TrimmedConfig;
  type: "pre" | "post";
  attempt: UserTestAttempt | null;
  goToNextPage: () => void;
};

export function FormPage({
  config,
  type,
  attempt,
  goToNextPage,
}: FormPageProps) {
  const { token, isLoggedIn } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const form = type === "pre" ? config.preTestForm : config.postTestForm;
  const questions = form?.questions ?? [];

  const [answers, setAnswers] = useState<NewFormAnswer[]>(
    Array.from({ length: questions.length }, (_, i) => ({
      questionId: questions[i].id,
    }))
  );

  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | ApiHttpError | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !isLoggedIn) {
        return;
      }

      try {
        const response = await api.getCurrentUser();
        if (response.data) {
          setUser(response.data);
        } else if (response.error) {
          setError(response.error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [token, isLoggedIn]);

  if (!attempt) {
    return (
      <div>
        <p>Cargando formulario...</p>
      </div>
    );
  }

  if (!form) {
    goToNextPage();
    return (
      <div>
        <p>No hay formulario</p>
      </div>
    );
  }

  if ((type === "pre" && attempt.completedPreTestForm) || (type === "post" && attempt.completedPostTestForm)) {
    goToNextPage();
    return (
      <div>
        <p>Formulario ya fue respondido</p>
      </div>
    );
  }

  const title = type === "pre"
    ? t(config, "preTest.title")
    : t(config, "postTest.title");

  const handleOptionChange = (questionIndex: number, optionId: number, optionText: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = {
        ...newAnswers[questionIndex],
        optionId: optionId,
        answer: optionText,
      };
      return newAnswers;
    });
  };

  const handleOtherChange = (questionIndex: number, otherText: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = {
        ...newAnswers[questionIndex],
        answer: otherText,
      };
      return newAnswers;
    });
  };

  const handleSliderChange = (questionIndex: number, value: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = {
        ...newAnswers[questionIndex],
        value: value,
      };
      return newAnswers;
    });
  };

  const submitEndPostForm = async () => {
    if (token && form && type === "post") {
      try {
        const response = await api.endTest();
        if (response.error) {
          setError(response.error);
          return false;
        }
        return true;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const allAnswered = answers.every((answer, idx) => {
      const question = questions[idx];
      if (question.type === "slider") {
        return answer.value !== undefined;
      }
      return answer.answer !== undefined && answer.answer.length > 0;
    });

    if (!allAnswered) {
      setSending(false);
      return;
    }

    if (!token || !isLoggedIn) {
      setSending(false);
      return;
    }

    if (!user?.username) {
      setSending(false);
      return;
    }

    const cleanedAnswers = answers.map((answer, idx) => {
      const question = questions[idx];

      const cleaned: NewFormAnswer = {
        questionId: answer.questionId,
      };

      if (question.type === "select-one" || question.type === "select-multiple") {
        if (answer.optionId !== undefined) {
          cleaned.optionId = answer.optionId;
        } else if (answer.answer !== undefined) {
          cleaned.answer = answer.answer;
        }
      } else if (question.type === "slider") {
        cleaned.value = answer.value;
      } else {
        cleaned.answer = answer.answer;
      }

      return cleaned;
    });

    try {
      const result = await api.submitFormAnswers({
        path: { formType: type },
        body: {
          answers: cleanedAnswers,
        }
      });

      if (result.error) {
        setError(result.error);
        setSending(false);
        return;
      }

      if (type === "post") {
        const endTestSuccess = await submitEndPostForm();
        if (!endTestSuccess) {
          setSending(false);
          return;
        }
      }
      goToNextPage();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
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
                    answer={answers[idx].answer ?? ""}
                    optionId={answers[idx].optionId ?? 0}
                    onOptionChange={(optionId, optionText) => handleOptionChange(idx, optionId, optionText)}
                    onOtherChange={(otherText) => handleOtherChange(idx, otherText)}
                  />
                );

              case "slider":
                return (
                  <SliderQuestion
                    key={question.id}
                    question={question as Slider}
                    answer={answers[idx].value ?? (question as Slider).min}
                    setAnswer={(value) => handleSliderChange(idx, value)}
                  />
                );

              case "text-short":
              case "text-long":
              default:
                return null;
            }
          })}

          <div className={styles.sendButtonContainer}>
            {error && (
              <ErrorDisplay
                error={error}
                onClose={() => setError(null)}
              />
            )}

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
