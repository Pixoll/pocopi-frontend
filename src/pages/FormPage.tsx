import api, {
  type User,
  type TrimmedConfig,
  type NewFormAnswer,
  type SelectOne,
  type Slider,
  type ApiHttpError
} from "@/api";
import { SelectOneQuestion } from "@/components/FormPage/SelectOneQuestion";
import { SliderQuestion } from "@/components/FormPage/SliderQuestion";
import { Spinner } from "@/components/Spinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import styles from "@/styles/FormPage/FormPage.module.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FormEvent, useEffect, useState } from "react";
import { t } from "@/utils/translations.ts";
import { useAuth } from "@/contexts/AuthContext.tsx";

type FormPageProps = {
  config: TrimmedConfig;
  type: "pre-test" | "post-test";
  goToNextPage: () => void;
};

export function FormPage({
                           config,
                           type,
                           goToNextPage,
                         }: FormPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const form = type === "pre-test" ? config.preTestForm : config.postTestForm;
  const questions = form?.questions ?? [];
  const { token } = useAuth();

  const [answers, setAnswers] = useState<NewFormAnswer[]>(
    Array.from({ length: questions.length }, (_, i) => ({
      questionId: questions[i].id,
      optionId: -1,
      value: 0,
      answer: "",
    }))
  );

  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | ApiHttpError | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.getCurrentUser({
            auth: token
          });
          if (response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    if (questions.length === 0) {
      goToNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!form) {
    goToNextPage();
    return (
      <div>
        <p>No hay formulario</p>
      </div>
    );
  }

  const title = type === "pre-test"
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
        optionId: -1,
        answer: otherText,
      };
      return newAnswers;
    });
  };

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

    if (!user?.username) {
      setSending(false);
      setError("User information not available");
      return;
    }

    const cleanedAnswers = answers.map((answer, idx) => {
      const cleaned: any = {
        questionId: answer.questionId,
      };

      const question = questions[idx];

      if (question.type === 'select-one' || question.type === 'select-multiple') {
        if (answer.optionId !== -1) {
          cleaned.optionId = answer.optionId;
        } else {
          cleaned.answer = answer.answer;
        }
      } else if (question.type === 'slider') {
        cleaned.value = +answer.answer || 0;
      } else {
        cleaned.answer = answer.answer;
      }

      return cleaned;
    });

    try {
      const result = await api.submitFormAnswers({
        auth: token,
        body: {
          username: user.username,
          formId: form.id,
          answers: cleanedAnswers,
        }
      });
      
      if (result.error) {
        setError(result.error);
        console.error(result.error);
      } else {
        goToNextPage();
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
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
                    optionId={answers[idx].optionId}
                    onOptionChange={(optionId, optionText) => handleOptionChange(idx, optionId, optionText)}
                    onOtherChange={(otherText) => handleOtherChange(idx, otherText)}
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
                  <Spinner />
                </>
                : <>
                  {t(config, "form.sendAnswers")}
                  <FontAwesomeIcon icon={faArrowRight} />
                </>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
