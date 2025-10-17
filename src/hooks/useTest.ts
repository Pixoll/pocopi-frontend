import type {NewUser, Protocol} from "@/api";
import {type SendOptionEvent, useWebSocket} from "@/hooks/useWebSocket.ts";
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

export function useTest(
  protocol: Protocol,
  userData: NewUser,
): Test {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showedSummary, setShowedSummary] = useState(false);
  const [answers, setAnswers] = useState<Answers>(Object.fromEntries(
    protocol.phases?.map((phase) =>
      [phase.id, Object.fromEntries(phase.questions.map((question) =>
        [question.id, null]
      ))]
    )
  ));

  const { send: sendWebSocketEvent } = useWebSocket<SendOptionEvent>({
    onOpen: () => console.log('webSocket connected'),
    onData: (data) => console.log('response:', data),
    onError: () => console.error('error WebSocket'),
    onClose: () => console.log('webSocket closed'),
  });

  const { phases, allowPreviousPhase, allowPreviousQuestion, allowSkipQuestion } = protocol;
  const phase = phases[phaseIndex];
  const { id: phaseId, questions } = phase;
  const { id: questionId/*, options*/ } = questions[questionIndex];
  const username = userData.username?.toString() ?? "";

  const setAnswer = (phaseId: number, questionId: number, optionId: number | null) => {
    setAnswers((prev) => {
      prev[phaseId][questionId] = optionId;
      return { ...prev };
    });
  };

  const goToPreviousPhase = () => {
    if (!allowPreviousPhase || phaseIndex <= 0) {
      return;
    }

    const newQuestionIndex = phases[phaseIndex - 1].questions.length - 1;
    const targetPhase = phases[phaseIndex - 1];
    const targetQuestion = targetPhase.questions[newQuestionIndex];
    setPhaseIndex(phaseIndex - 1);
    setQuestionIndex(newQuestionIndex);
    setSelectedOptionId(answers[targetPhase.id][targetQuestion.id]);
  };

  const quitSummary = (onFinish: () => void, shouldAdvancePhase: boolean = true) => {
    setShowSummary(false);

    if (!shouldAdvancePhase) {
      return;
    }

    setShowedSummary(false);

    if (phaseIndex < phases.length - 1) {
      const targetPhase = phases[phaseIndex + 1];
      const targetQuestion = targetPhase.questions[0];
      setPhaseIndex(phaseIndex + 1);
      setQuestionIndex(0);
      setSelectedOptionId(answers[targetPhase.id][targetQuestion.id]);
      return;
    }

    onFinish();
  };

  const goToSummary = () => {
    if (!allowPreviousPhase) {
      const newQuestionIndex = phase.questions.length - 1;
      const targetQuestion = questions[newQuestionIndex];
      setQuestionIndex(newQuestionIndex);
      setSelectedOptionId(answers[phaseId][targetQuestion.id]);
    } else {
      const newPhaseIndex = phases.length - 1;
      const targetPhase = phases[newPhaseIndex];
      const newQuestionIndex = targetPhase.questions.length - 1;
      const targetQuestion = targetPhase.questions[newQuestionIndex];
      setPhaseIndex(newPhaseIndex);
      setQuestionIndex(newQuestionIndex);
      setSelectedOptionId(answers[targetPhase.id][targetQuestion.id]);
    }

    setShowSummary(true);
    setShowedSummary(true);
  };

  const goToNextPhase = () => {
    if (allowPreviousPhase && phaseIndex < phases.length - 1) {
      const targetPhase = phases[phaseIndex + 1];
      const targetQuestion = targetPhase.questions[0];
      setPhaseIndex(phaseIndex + 1);
      setQuestionIndex(0);
      setSelectedOptionId(answers[targetPhase.id][targetQuestion.id]);
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
    setSelectedOptionId(answers[phaseId][targetQuestion.id]);
  };

  const goToNextQuestion = () => {
    if (selectedOptionId === null && !allowSkipQuestion) {
      return;
    }

    if (questionIndex < questions.length - 1) {
      const targetQuestion = phase.questions[questionIndex + 1];
      setQuestionIndex(questionIndex + 1);
      setSelectedOptionId(answers[phaseId][targetQuestion.id]);
      return;
    }

    goToNextPhase();
  };

  const jumpToQuestion = (phaseIndex: number, questionIndex: number) => {
    const targetPhase = phases[phaseIndex];
    const targetQuestion = targetPhase.questions[questionIndex];

    setPhaseIndex(phaseIndex);
    setQuestionIndex(questionIndex);
    setSelectedOptionId(answers[targetPhase.id][targetQuestion.id]);
    quitSummary(() => {}, false);
  };

  const onOptionClick = (optionId: number) => {
    if (selectedOptionId === optionId) {
      setAnswer(phaseId, questionId, null);

      sendWebSocketEvent({
        username,
        optionId,
        type: 'deselect'
      });
    } else {
      setAnswer(phaseId, questionId, optionId);

      sendWebSocketEvent({
        username,
        optionId,
        type: 'select'
      });
    }

    setSelectedOptionId((v) => (v === optionId ? null : optionId));
  };

  const onOptionHover = (optionId: number) => {
    sendWebSocketEvent({
      username,
      optionId,
      type: 'hover'
    });
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
