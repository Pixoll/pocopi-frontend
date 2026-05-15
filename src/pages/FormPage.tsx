import api, { type ApiHttpError, type NewFormAnswer, type TrimmedConfig, type User, type UserTestAttempt } from "@/api";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { SelectMultipleQuestion } from "@/components/FormPage/SelectMultipleQuestion";
import { SelectOneQuestion } from "@/components/FormPage/SelectOneQuestion";
import { SliderQuestion } from "@/components/FormPage/SliderQuestion";
import { TextQuestion } from "@/components/FormPage/TextQuestion";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/FormPage/FormPage.module.css";
import { t } from "@/utils/translations";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const [answers, setAnswers] = useState<Record<number, NewFormAnswer>>(
    questions.filter(q => q.type !== "select-multiple")
      .reduce<Record<number, NewFormAnswer>>((acc, q) => {
        acc[q.id] = {
          questionId: q.id,
        };
        return acc;
      }, {})
  );
  const [multiAnswers, setMultiAnswers] = useState(
    questions.filter(q => q.type === "select-multiple")
      .reduce<Record<number, NewFormAnswer[]>>((acc, q) => {
        acc[q.id] = [];
        return acc;
      }, {})
  );

  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | ApiHttpError | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const popState = () => {
      window.history.pushState(null, "", window.location.href);
      alert("No puedes volver a la página anterior");
    };

    window.addEventListener("popstate", popState);

    return () => {
      window.removeEventListener("popstate", popState);
    };
  }, []);

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

  useEffect(() => {
    if (!isLoggedIn || !attempt) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoggedIn, attempt, navigate]);

  if (!isLoggedIn) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.loadingContainer}>
            <Spinner/>
            <p className={styles.info}>No has iniciado sesión...</p>
            <p className={styles.redirectText}>Redirigiendo al inicio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.loadingContainer}>
            <Spinner/>
            <p>No hay un intento de test activo...</p>
            <p className={styles.redirectText}>Redirigiendo al inicio...</p>
          </div>
        </div>
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

  const handleOptionOrAnswerChange = (questionId: number, optionIdOrOther: number | string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      newAnswers[questionId] = {
        questionId,
        ...typeof optionIdOrOther === "number" ? {
          optionId: optionIdOrOther,
        } : {
          answer: optionIdOrOther,
        },
      };
      return newAnswers;
    });
    setValidationError("");
  };

  const handleMultiOptionChange = (questionId: number, optionIdOrOther: number | string) => {
    setMultiAnswers(prev => {
      const newAnswers = { ...prev };
      if (typeof optionIdOrOther === "number") {
        const without = newAnswers[questionId].filter(a => a.optionId !== optionIdOrOther);
        if (newAnswers[questionId].length === without.length) {
          newAnswers[questionId].push({
            questionId,
            optionId: optionIdOrOther,
          });
        } else {
          newAnswers[questionId] = without;
        }
      } else {
        const without = newAnswers[questionId].filter(a => a.answer === undefined);
        without.push({
          questionId,
          answer: optionIdOrOther,
        });
        newAnswers[questionId] = without;
      }
      return newAnswers;
    });
    setValidationError("");
  };

  const handleSliderChange = (questionId: number, value: number) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      newAnswers[questionId] = {
        questionId: newAnswers[questionId].questionId,
        value,
      };
      return newAnswers;
    });
    setValidationError("");
  };

  const endTest = async () => {
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
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");

    const multiAnswersList = Object.values(multiAnswers);
    const allAnswers = multiAnswersList.flat().concat(Object.values(answers));
    const someUnanswered = multiAnswersList.some(l => l.length === 0) || allAnswers.some(answer =>
      answer.questionId === undefined
      && answer.value === undefined
      && (answer.answer === undefined || answer.answer.length === 0)
    );

    if (someUnanswered) {
      setValidationError("Por favor responde todas las preguntas requeridas");
      return;
    }

    if (!token || !isLoggedIn || !user?.username) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      const result = await api.submitFormAnswers({
        path: { formType: type },
        body: {
          answers: allAnswers,
        }
      });

      if (result.error) {
        setError(result.error);
        setSending(false);
        return;
      }

      if (type === "post") {
        const endTestSuccess = await endTest();
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
          {questions.map(question => {
            switch (question.type) {
              case "select-one":
                return (
                  <SelectOneQuestion
                    key={question.id}
                    config={config}
                    question={question}
                    optionId={answers[question.id].optionId ?? -1}
                    onOptionChange={(optionId) => handleOptionOrAnswerChange(question.id, optionId)}
                    onOtherChange={(otherText) => handleOptionOrAnswerChange(question.id, otherText)}
                  />
                );

              case "select-multiple":
                return (
                  <SelectMultipleQuestion
                    key={question.id}
                    config={config}
                    question={question}
                    answers={multiAnswers[question.id]}
                    onOptionChange={(optionId) => handleMultiOptionChange(question.id, optionId)}
                    onOtherChange={(otherText) => handleMultiOptionChange(question.id, otherText)}
                  />
                );

              case "slider":
                return (
                  <SliderQuestion
                    key={question.id}
                    question={question}
                    answer={answers[question.id].value ?? question.min}
                    setAnswer={(value) => handleSliderChange(question.id, value)}
                  />
                );

              case "text-short":
              case "text-long":
              default:
                return (
                  <TextQuestion
                    question={question}
                    answer={answers[question.id].answer ?? ""}
                    onTextChange={(value) => handleOptionOrAnswerChange(question.id, value)}
                  />
                );
            }
          })}

          <div className={styles.sendButtonContainer}>
            {validationError && (
              <div className={styles.validationError}>
                {validationError}
              </div>
            )}

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
