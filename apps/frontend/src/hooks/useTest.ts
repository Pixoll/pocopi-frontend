import { TestAnalytics } from "@/analytics/TestAnalytics";
import type {CreateUserRequest, Protocol} from "@/api";
import { useEffect, useRef, useState } from "react";

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
  userData: CreateUserRequest,
): Test {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const analyticsRef = useRef<TestAnalytics | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showedSummary, setShowedSummary] = useState(false);
  const [answers, setAnswers] = useState<Answers>(Object.fromEntries(
    protocol.phases?.map((phase) =>
      [phase, Object.fromEntries(phase.questions.map((question) =>
        [question.id, null]
      ))]
    )
  ));

  const { phases, allowPreviousPhase, allowPreviousQuestion, allowSkipQuestion } = protocol;
  const phase = phases[phaseIndex];
  const { id: phaseId, questions } = phase;
  const { id: questionId, options } = questions[questionIndex];

  useEffect(() => {
    analyticsRef.current = new TestAnalytics(userData.username?.toString() ?? "", phaseId, questionId);
  }, [userData.username, phaseId, questionId]);

  const setAnswer = (phaseId: number, questionId: number, optionId: number | null) => {
    setAnswers((prev) => {
      prev[phaseId][questionId] = optionId;
      return { ...prev };
    });
  };

  const completeCurrentQuestion = () => {
    const selectedOption = options.find(o => o.id === selectedOptionId);

    analyticsRef.current?.completeQuestion(!!selectedOption, !!selectedOption?.correct);
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

    completeCurrentQuestion();

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

    completeCurrentQuestion();

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
    quitSummary(() => {
    }, false);
  };

  const onOptionClick = (optionId: number) => {
    if (selectedOptionId === optionId) {
      analyticsRef.current?.recordOptionDeselect(optionId);
      setAnswer(phaseId, questionId, null);
    } else {
      analyticsRef.current?.recordOptionSelect(optionId);
      setAnswer(phaseId, questionId, optionId);
    }
    setSelectedOptionId((v) => (v === optionId ? null : optionId));
  };

  const onOptionHover = (optionId: number) => {
    analyticsRef.current?.recordOptionHover(optionId);
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
