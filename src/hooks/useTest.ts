import api, { type NewOptionEventLog, type UserTestAttempt } from "@/api";
import { useMemo, useState } from "react";

export type Answers = Record<number, Record<number, number | null>>;

type Test = {
  phaseIndex: number;
  questionIndex: number;
  selectedOptionId: number | null;
  answers: Answers;
  showSummary: boolean;
  showedSummary: boolean;
  goToSummary: () => void;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
  onOptionClick: (optionId: number) => void;
  onOptionHover: (optionId: number) => void;
  quitSummary: (onFinish: () => void) => void;
  jumpToQuestion: (phaseIndex: number, questionIndex: number) => void;
};

export function useTest(attempt: UserTestAttempt, token: string): Test {
  const answersFromAttempt = useMemo(() => Object.fromEntries(attempt.testAnswers.map(answer =>
    [answer.questionId, answer.optionId]
  )) as Record<number, number>, [attempt]);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showedSummary, setShowedSummary] = useState(false);
  const [questionTimestamp, setQuestionTimestamp] = useState(() => Date.now());

  const [answers, setAnswers] = useState<Answers>(() => Object.fromEntries(
    attempt.assignedGroup.phases.map((phase, index) => [
      index,
      Object.fromEntries(phase.questions.map((q) =>
        [q.id, answersFromAttempt[q.id] ?? null]
      )),
    ])
  ));

  const { phases, allowPreviousPhase, allowPreviousQuestion, allowSkipQuestion } = attempt.assignedGroup;
  const phase = phases[phaseIndex];
  const { questions } = phase;
  const { id: questionId } = questions[questionIndex];

  const setAnswer = (phaseIdx: number, questionId: number, optionId: number | null) => {
    setAnswers((prev) => {
      prev[phaseIdx][questionId] = optionId;
      return { ...prev };
    });
  };

  const goToPreviousPhase = () => {
    if (!allowPreviousPhase || phaseIndex <= 0) {
      return;
    }

    const newPhaseIndex = phaseIndex - 1;
    const targetPhase = phases[newPhaseIndex];
    const newQuestionIndex = targetPhase.questions.length - 1;
    const targetQuestion = targetPhase.questions[newQuestionIndex];

    setPhaseIndex(newPhaseIndex);
    setQuestionIndex(newQuestionIndex);
    setSelectedOptionId(answers[newPhaseIndex][targetQuestion.id]);

    sendQuestionEvent(token, questionId, questionTimestamp);
    setQuestionTimestamp(Date.now());
  };

  const quitSummary = (onFinish: () => void, shouldAdvancePhase: boolean = true) => {
    setShowSummary(false);

    if (!shouldAdvancePhase) {
      return;
    }

    setShowedSummary(false);

    if (phaseIndex < phases.length - 1) {
      const newPhaseIndex = phaseIndex + 1;
      const targetPhase = phases[newPhaseIndex];
      const targetQuestion = targetPhase.questions[0];

      setPhaseIndex(newPhaseIndex);
      setQuestionIndex(0);
      setSelectedOptionId(answers[newPhaseIndex][targetQuestion.id]);

      setQuestionTimestamp(Date.now());
    } else {
      onFinish();
    }
  };

  const goToSummary = () => {
    setShowSummary(true);
    setShowedSummary(true);

    sendQuestionEvent(token, questionId, questionTimestamp);
    setQuestionTimestamp(Date.now());
  };

  const goToNextPhase = () => {
    if (allowPreviousPhase && phaseIndex < phases.length - 1) {
      const newPhaseIndex = phaseIndex + 1;
      const targetPhase = phases[newPhaseIndex];
      const targetQuestion = targetPhase.questions[0];

      setPhaseIndex(newPhaseIndex);
      setQuestionIndex(0);
      setSelectedOptionId(answers[newPhaseIndex][targetQuestion.id]);

      sendQuestionEvent(token, questionId, questionTimestamp);
      setQuestionTimestamp(Date.now());

      return;
    }

    goToSummary();
  };

  const goToPreviousQuestion = () => {
    if (!allowPreviousQuestion) {
      return;
    }

    if (questionIndex <= 0) {
      goToPreviousPhase();
      return;
    }

    const targetQuestion = phase.questions[questionIndex - 1];

    setQuestionIndex(questionIndex - 1);
    setSelectedOptionId(answers[phaseIndex][targetQuestion.id]);

    sendQuestionEvent(token, questionId, questionTimestamp);
    setQuestionTimestamp(Date.now());
  };

  const goToNextQuestion = () => {
    if (selectedOptionId === null && !allowSkipQuestion) {
      return;
    }

    if (questionIndex < questions.length - 1) {
      const targetQuestion = phase.questions[questionIndex + 1];

      setQuestionIndex(questionIndex + 1);
      setSelectedOptionId(answers[phaseIndex][targetQuestion.id]);

      sendQuestionEvent(token, questionId, questionTimestamp);
      setQuestionTimestamp(Date.now());

      return;
    }

    goToNextPhase();
  };

  const jumpToQuestion = (newPhaseIndex: number, newQuestionIndex: number) => {
    const targetPhase = phases[newPhaseIndex];
    const targetQuestion = targetPhase.questions[newQuestionIndex];

    setPhaseIndex(newPhaseIndex);
    setQuestionIndex(newQuestionIndex);
    setSelectedOptionId(answers[newPhaseIndex][targetQuestion.id]);

    setQuestionTimestamp(Date.now());

    quitSummary(() => {
    }, false);
  };

  const onOptionClick = async (optionId: number) => {
    if (selectedOptionId === optionId) {
      setAnswer(phaseIndex, questionId, null);
      sendOptionEvent(token, optionId, "deselect");
    } else {
      setAnswer(phaseIndex, questionId, optionId);
      sendOptionEvent(token, optionId, "select");
    }
    setSelectedOptionId((v) => (v === optionId ? null : optionId));
  };

  const onOptionHover = async (optionId: number) => {
    sendOptionEvent(token, optionId, "hover");
  };

  return {
    phaseIndex,
    questionIndex,
    selectedOptionId,
    answers,
    showSummary,
    showedSummary,
    quitSummary,
    goToSummary,
    goToPreviousQuestion,
    goToNextQuestion,
    onOptionClick,
    onOptionHover,
    jumpToQuestion,
  };
}

function sendQuestionEvent(token: string, questionId: number, timestamp: number): void {
  try {
    // noinspection JSIgnoredPromiseFromCall
    api.saveQuestionEventLog({
      body: {
        questionId,
        timestamp,
        duration: Date.now() - timestamp,
      },
    });
  } catch (error) {
    console.error("Error al enviar evento de pregunta:", error);
  }
}

function sendOptionEvent(token: string, optionId: number, type: NewOptionEventLog["type"]): void {
  try {
    // noinspection JSIgnoredPromiseFromCall
    api.saveOptionEventLog({
      body: {
        optionId,
        type,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Error al enviar evento de opción:", error);
  }
}
