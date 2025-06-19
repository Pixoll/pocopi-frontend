import { TestAnalytics } from "@/analytics/TestAnalytics";
import { UserData } from "@/types/user";
import { Group, Image, TestOption } from "@pocopi/config";
import { useEffect, useRef, useState } from "react";

export type Option = TestOption & {
  key: string;
  id: number;
};

type AnsweredQuestion = {
  id: string;
  answered: boolean;
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
  answeredQuestions: AnsweredQuestion[];
  jumpToQuestion: (index: number) => void;
};

export function useTest(
  group: Group,
  userData: UserData,
): Test {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  
  const analyticsRef = useRef<TestAnalytics | null>(null);
  
  useEffect(() => {
    analyticsRef.current = new TestAnalytics(userData.id, phaseIndex + 1, questionIndex + 1);
  }, [userData.id, phaseIndex, questionIndex]);
  
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
  
  const recordAnswer = (index: number, optionId: number | null) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: optionId,
    }));
  };
  
  const goToPreviousPhase = (goToLastQuestion: unknown = false, markedAsComplete: unknown = false) => {
    if (!allowPreviousPhase || phaseIndex <= 0) return;
    
    const newQuestionIndex = goToLastQuestion === true ? phases[phaseIndex - 1].questions.length - 1 : 0;
    
    if (!markedAsComplete) completeCurrentQuestion();
    
    setPhaseIndex(phaseIndex - 1);
    setQuestionIndex(newQuestionIndex);
    setSelectedOptionId(answers[newQuestionIndex] ?? null);
  };
  
  const goToNextPhase = (onFinish: () => void, markedAsComplete: unknown = false) => {
    if (selectedOptionId === null && !allowSkipPhase) return;
    
    if (!markedAsComplete) completeCurrentQuestion();
    
    recordAnswer(questionIndex, selectedOptionId);
    
    if (phaseIndex < phases.length - 1) {
      setPhaseIndex(phaseIndex + 1);
      setQuestionIndex(0);
      setSelectedOptionId(answers[0] ?? null);
      return;
    }
    
    onFinish();
  };
  
  const goToPreviousQuestion = () => {
    if (!allowPreviousQuestion) return;
    
    completeCurrentQuestion();
    
    if (questionIndex <= 0) {
      goToPreviousPhase(true, true);
      return;
    }
    
    setQuestionIndex(questionIndex - 1);
    setSelectedOptionId(answers[questionIndex - 1] ?? null);
  };
  
  const goToNextQuestion = (onFinish: () => void) => {
    if (selectedOptionId === null && !allowSkipQuestion) return;
    
    completeCurrentQuestion();
    recordAnswer(questionIndex, selectedOptionId);
    
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOptionId(answers[questionIndex + 1] ?? null);
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
  
  const answeredQuestions = questions.map((_, idx) => ({
    id: `q-${idx + 1}`,
    answered: answers[idx] !== undefined && answers[idx] !== null,
  }));
  
  const jumpToQuestion = (index: number) => {
    setQuestionIndex(index);
    setSelectedOptionId(answers[index] ?? null);
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
    answeredQuestions,
    jumpToQuestion,
  };
}
