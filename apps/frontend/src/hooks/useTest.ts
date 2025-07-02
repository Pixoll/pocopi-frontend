import { TestAnalytics } from "@/analytics/TestAnalytics";
import type { User } from "@/api";
import type { Group, Image, TestOption } from "@pocopi/config";
import { useEffect, useRef, useState } from "react";

export type Answers = Record<number, Record<number, number | null>>;

type Test = {
  phaseIndex: number;
  questionIndex: number;
  selectedOptionId: number | null;
  questionText?: string;
  questionImage?: Image;
  options: readonly TestOption[];
  optionsColumns: number;
  progressPercentage: number;
  totalPhaseQuestions: number;
  phasesCount: number;
  allowPreviousPhase: boolean;
  isNextPhaseHidden: boolean;
  showSummary: boolean;
  allowPreviousQuestion: boolean;
  isNextQuestionDisabled: boolean;
  answers: Answers;
  goToPreviousPhase: () => void;
  goToNextPhase: (onFinish: () => void) => void;
  goToPreviousQuestion: () => void;
  goToNextQuestion: (onFinish: () => void) => void;
  onOptionClick: (optionId: number) => void;
  onOptionHover: (optionId: number) => void;
  quitSummary: (onFinish: () => void) => void;
  jumpToQuestion: (phaseIndex: number, questionIndex: number) => void;
};

export function useTest(
  group: Group,
  userData: User,
): Test {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const analyticsRef = useRef<TestAnalytics | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [answers, setAnswers] = useState<Answers>(Object.fromEntries(
    group.protocol.phases.map((phase) =>
      [phase.id, Object.fromEntries(phase.questions.map((question) =>
        [question.id, null]
      ))]
    )
  ));

  const { phases, allowPreviousPhase, allowSkipPhase, allowPreviousQuestion, allowSkipQuestion } = group.protocol;
  const { id: phaseId, questions } = phases[phaseIndex];
  const { id: questionId, text: questionText, image: questionImage, options } = questions[questionIndex];

  useEffect(() => {
    analyticsRef.current = new TestAnalytics(userData.id, phaseId, questionId);
  }, [userData.id, phaseId, questionId]);

  const phasesCount = group.protocol.phases.length;
  const totalPhaseQuestions = questions.length;
  const optionsColumns = Math.ceil(options.length / 2);
  const isNextPhaseHidden = !allowSkipPhase;

  const isNextQuestionDisabled = allowSkipQuestion
    ? false
    : selectedOptionId === null;

  const totalTestQuestions = phases.reduce((acc, phase) => acc + phase.questions.length, 0);
  const currentQuestionNumber = (showSummary ? 1 : 0) + questionIndex + phases
    .slice(0, phaseIndex)
    .reduce((acc, phase) => acc + phase.questions.length, 0);

  const progressPercentage = (currentQuestionNumber / totalTestQuestions) * 100;

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

  const goToPreviousPhase = (goToLastQuestion: unknown = false, markedAsComplete: unknown = false) => {
    if (!allowPreviousPhase || phaseIndex <= 0) {
      return;
    }

    const newQuestionIndex = goToLastQuestion === true ? phases[phaseIndex - 1].questions.length - 1 : 0;

    if (!markedAsComplete) {
      completeCurrentQuestion();
    }

    const targetPhase = phases[phaseIndex - 1];
    const targetQuestion = targetPhase.questions[newQuestionIndex];
    setPhaseIndex(phaseIndex - 1);
    setQuestionIndex(newQuestionIndex);
    setSelectedOptionId(answers[targetPhase.id][targetQuestion.id]);
  };

  const quitSummary = (onFinish: () => void, shouldAdvancePhase: boolean = true) => {
    setShowSummary(false);

    if (shouldAdvancePhase) {
      if (phaseIndex < phases.length - 1) {
        const targetPhase = phases[phaseIndex + 1];
        const targetQuestion = targetPhase.questions[0];
        setPhaseIndex(phaseIndex + 1);
        setQuestionIndex(0);
        setSelectedOptionId(answers[targetPhase.id][targetQuestion.id]);
        return;
      }
      onFinish();
    }
  };

  const goToNextPhase = (onFinish: () => void, markedAsComplete: unknown = false) => {
    if (selectedOptionId === null && !allowSkipPhase) {
      return;
    }

    if (!markedAsComplete) {
      completeCurrentQuestion();
    }

    if (phaseIndex < phases.length - 1) {
      if (allowPreviousPhase) {
        const targetPhase = phases[phaseIndex + 1];
        const targetQuestion = targetPhase.questions[0];
        setPhaseIndex(phaseIndex + 1);
        setQuestionIndex(0);
        setSelectedOptionId(answers[targetPhase.id][targetQuestion.id]);
      } else {
        setShowSummary(true);
      }
      return;
    }

    if (phaseIndex === phases.length - 1 && allowPreviousPhase) {
      setShowSummary(true);
      return;
    }

    onFinish();
  };

  const goToPreviousQuestion = () => {
    if (!allowPreviousQuestion) {
      return;
    }

    completeCurrentQuestion();

    if (questionIndex <= 0) {
      goToPreviousPhase(true, true);
      return;
    }

    const targetQuestion = phases[phaseIndex].questions[questionIndex - 1];
    setQuestionIndex(questionIndex - 1);
    setSelectedOptionId(answers[phaseId][targetQuestion.id]);
  };

  const goToNextQuestion = (onFinish: () => void) => {
    if (selectedOptionId === null && !allowSkipQuestion) {
      return;
    }

    completeCurrentQuestion();

    if (questionIndex < questions.length - 1) {
      const targetQuestion = phases[phaseIndex].questions[questionIndex + 1];
      setQuestionIndex(questionIndex + 1);
      setSelectedOptionId(answers[phaseId][targetQuestion.id]);
      return;
    }

    goToNextPhase(onFinish, true);
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
    questionText,
    questionImage,
    options,
    optionsColumns,
    progressPercentage,
    totalPhaseQuestions,
    phasesCount,
    allowPreviousPhase,
    isNextPhaseHidden,
    allowPreviousQuestion,
    isNextQuestionDisabled,
    showSummary,
    answers,
    quitSummary,
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    onOptionClick,
    onOptionHover,
    jumpToQuestion,
  };
}
