import api, { type AssignedTestGroup} from "@/api";
import { useState } from "react";

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

function sendOptionEvent(
  token: string,
  optionId: number,
  type: "select" | "deselect" | "hover"
) {
  try {
    api.saveOptionEventLog({
      auth: token,
      body: {
        optionId: optionId,
        type,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Error al enviar evento de opción:", error);
  }
}

export function useTest(protocol: AssignedTestGroup, token: string): Test {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showedSummary, setShowedSummary] = useState(false);

  const [answers, setAnswers] = useState<Answers>(
    Object.fromEntries(
      protocol.phases.map((phase, index) => [
        index,
        Object.fromEntries(phase.questions.map((q) => [q.id, null])),
      ])
    )
  );

  const { phases, allowPreviousPhase, allowPreviousQuestion, allowSkipQuestion } = protocol;
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
    if (!allowPreviousPhase || phaseIndex <= 0) return;
    const newPhaseIndex = phaseIndex - 1;
    const targetPhase = phases[newPhaseIndex];
    const newQuestionIndex = targetPhase.questions.length - 1;
    const targetQuestion = targetPhase.questions[newQuestionIndex];
    setPhaseIndex(newPhaseIndex);
    setQuestionIndex(newQuestionIndex);
    setSelectedOptionId(answers[newPhaseIndex][targetQuestion.id]);
  };

  const quitSummary = (onFinish: () => void, shouldAdvancePhase: boolean = true) => {
    setShowSummary(false);
    if (!shouldAdvancePhase) return;

    setShowedSummary(false);

    if (phaseIndex < phases.length - 1) {
      const newPhaseIndex = phaseIndex + 1;
      const targetPhase = phases[newPhaseIndex];
      const targetQuestion = targetPhase.questions[0];
      setPhaseIndex(newPhaseIndex);
      setQuestionIndex(0);
      setSelectedOptionId(answers[newPhaseIndex][targetQuestion.id]);
    } else {
      onFinish();
    }
  };

  const goToSummary = () => {
    setShowSummary(true);
    setShowedSummary(true);
  };

  const goToNextPhase = () => {
    if (allowPreviousPhase && phaseIndex < phases.length - 1) {
      const newPhaseIndex = phaseIndex + 1;
      const targetPhase = phases[newPhaseIndex];
      const targetQuestion = targetPhase.questions[0];
      setPhaseIndex(newPhaseIndex);
      setQuestionIndex(0);
      setSelectedOptionId(answers[newPhaseIndex][targetQuestion.id]);
      return;
    }

    goToSummary();
  };

  const goToPreviousQuestion = () => {
    if (!allowPreviousQuestion) return;
    if (questionIndex <= 0) {
      goToPreviousPhase();
      return;
    }
    const targetQuestion = phase.questions[questionIndex - 1];
    setQuestionIndex(questionIndex - 1);
    setSelectedOptionId(answers[phaseIndex][targetQuestion.id]);
  };

  const goToNextQuestion = () => {
    if (selectedOptionId === null && !allowSkipQuestion) return;
    if (questionIndex < questions.length - 1) {
      const targetQuestion = phase.questions[questionIndex + 1];
      setQuestionIndex(questionIndex + 1);
      setSelectedOptionId(answers[phaseIndex][targetQuestion.id]);
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
    quitSummary(() => {}, false);
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
