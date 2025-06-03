import { TestAnalytics } from "@/analytics/TestAnalytics";
import { UserData } from "@/types/user";
import { Group, Image, TestOption } from "@pocopi/config";
import { useEffect, useRef, useState } from "react";

export type Option = TestOption & {
  key: string;
  id: number;
};

type Test = {
  phaseIndex: number;
  questionIndex: number;
  selectedOptionId: number | null;
  questionText?: string;
  questionImage?: Image;
  options: readonly Option[];
  optionsColumns: number;
  progressPercentage: number;
  totalPhaseQuestions: number;
  phasesCount: number;
  allowPreviousPhase: boolean;
  isNextPhaseHidden: boolean;
  allowPreviousQuestion: boolean;
  isNextQuestionDisabled: boolean;
  goToPreviousPhase: () => void;
  goToNextPhase: (onFinish: () => void) => void;
  goToPreviousQuestion: () => void;
  goToNextQuestion: (onFinish: () => void) => void;
  handleOptionClick: (id: number) => void;
  handleOptionHover: (id: number) => void;
};

export function useTest(
  group: Group,
  studentData: UserData,
): Test {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const analyticsRef = useRef<TestAnalytics | null>(null);

  useEffect(() => {
    analyticsRef.current = new TestAnalytics(studentData.id, phaseIndex + 1, questionIndex + 1);
  }, [studentData.id, phaseIndex, questionIndex]);

  const { phases, allowPreviousPhase, allowSkipPhase } = group.protocol;
  const { questions, allowPreviousQuestion, allowSkipQuestion } = phases[phaseIndex];
  const { text: questionText, image: questionImage, options: tempOptions } = questions[questionIndex];

  const phasesCount = group.protocol.phases.length;

  const isNextPhaseHidden = !allowSkipPhase;

  const isNextQuestionDisabled = allowSkipQuestion
    ? false
    : selectedOptionId === null;

  const totalPhaseQuestions = questions.length;

  const options = tempOptions.map<Option>((option, index) => ({
    key: option.image?.src ?? option.text!,
    id: index + 1,
    ...option,
  }));

  const optionsColumns = Math.ceil(options.length / 2);

  const totalTestQuestions = phases.reduce(
    (acc, phase) => acc + phase.questions.length,
    0
  );
  const currentQuestionNumber = questionIndex + phases
    .slice(0, phaseIndex)
    .reduce(
      (acc, phase) => acc + phase.questions.length,
      0
    );
  const progressPercentage = (currentQuestionNumber / totalTestQuestions) * 100;

  const completeCurrentQuestion = () => {
    const selectedOption = options.find(o => o.id === selectedOptionId);

    analyticsRef.current?.completeQuestion(!!selectedOption, !!selectedOption?.correct);
  };

  // parameter is meant to be private inside this hook, do not add signature to return value type
  const goToPreviousPhase = (goToLastQuestion: unknown = false, markedAsComplete: unknown = false) => {
    if (!allowPreviousPhase || phaseIndex <= 0) {
      return;
    }

    const newQuestionIndex = goToLastQuestion === true ? phases[phaseIndex - 1].questions.length - 1 : 0;

    if (!markedAsComplete) {
      completeCurrentQuestion();
    }

    setPhaseIndex(phaseIndex - 1);
    setQuestionIndex(newQuestionIndex);
    setSelectedOptionId(null);
  };

  const goToNextPhase = (onFinish: () => void, markedAsComplete: unknown = false) => {
    if (selectedOptionId === null && !allowSkipPhase) {
      return;
    }

    if (!markedAsComplete) {
      completeCurrentQuestion();
    }

    if (phaseIndex < phases.length - 1) {
      setPhaseIndex(phaseIndex + 1);
      setQuestionIndex(0);
      setSelectedOptionId(null);
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

    setQuestionIndex(questionIndex - 1);
    setSelectedOptionId(null);
  };

  const goToNextQuestion = (onFinish: () => void) => {
    if (selectedOptionId === null && !allowSkipQuestion) {
      return;
    }

    completeCurrentQuestion();

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOptionId(null);
      return;
    }

    goToNextPhase(onFinish, true);
  };

  const handleOptionClick = (id: number) => {
    if (selectedOptionId === id) {
      analyticsRef.current?.recordOptionDeselect(id);
    } else {
      analyticsRef.current?.recordOptionSelect(id);
    }

    setSelectedOptionId((v) => (v === id ? null : id));
  };

  const handleOptionHover = (id: number) => {
    analyticsRef.current?.recordOptionHover(id);
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
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    handleOptionClick,
    handleOptionHover,
  };
}
