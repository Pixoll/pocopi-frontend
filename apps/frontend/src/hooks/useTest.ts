import { StudentData } from "@/types/student";
import { saveStudentDataToStorage, TestAnalytics } from "@/utils/TestAnalytics";
import { Group, Image, TestOption } from "@pocopi/config";
import { useEffect, useRef, useState } from "react";

export type Option = TestOption & {
  id: string;
};

type Test = {
  phaseIndex: number;
  questionIndex: number;
  selectedOptionId: string;
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
  handleOptionClick: (id: string) => void;
};

export function useTest(
  group: Group,
  studentData: StudentData | null,
): Test {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const analyticsRef = useRef<TestAnalytics | null>(null);

  useEffect(() => {
    analyticsRef.current = new TestAnalytics(group.label);
    if (studentData?.id) {
      analyticsRef.current.setParticipantId(studentData.id);
      saveStudentDataToStorage(studentData.id, {
        name: studentData.name,
        email: studentData.email,
        age: studentData.age,
      });
    }
    analyticsRef.current.startPhase(0);
    analyticsRef.current.startQuestion(0, 0);
  }, [group, studentData]);

  const { phases, allowPreviousPhase, allowSkipPhase } = group.protocol;
  const { questions, allowPreviousQuestion, allowSkipQuestion } = phases[phaseIndex];
  const { text: questionText, image: questionImage, options: tempOptions } = questions[questionIndex];

  const phasesCount = group.protocol.phases.length;

  const isNextPhaseHidden = !allowSkipPhase;

  const isNextQuestionDisabled = allowSkipQuestion
    ? false
    : selectedOptionId === "";

  const totalPhaseQuestions = questions.length;

  const options = tempOptions.map<Option>((option) => ({
    id: option.image?.src ?? option.text!,
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
    if (!selectedOptionId || !analyticsRef.current) {
      return;
    }

    const selectedOption = options.find(o => o.id === selectedOptionId);

    if (selectedOption) {
      analyticsRef.current.completeQuestion();
    }
  };

  // parameter is meant to be private inside this hook, do not add signature to return value type
  const goToPreviousPhase = (goToLastQuestion: unknown = false) => {
    if (!allowPreviousPhase || phaseIndex <= 0) {
      return;
    }

    const newQuestionIndex = goToLastQuestion === true ? phases[phaseIndex - 1].questions.length - 1 : 0;

    completeCurrentQuestion();
    analyticsRef.current?.completePhase(phaseIndex);
    setPhaseIndex(phaseIndex - 1);
    setQuestionIndex(newQuestionIndex);
    setSelectedOptionId("");
    analyticsRef.current?.startPhase(phaseIndex - 1);
    analyticsRef.current?.startQuestion(phaseIndex - 1, newQuestionIndex);
  };

  const goToNextPhase = (onFinish: () => void) => {
    if (!selectedOptionId && !allowSkipPhase) {
      return;
    }

    completeCurrentQuestion();
    analyticsRef.current?.completePhase(phaseIndex);

    if (phaseIndex < phases.length - 1) {
      setPhaseIndex(phaseIndex + 1);
      setQuestionIndex(0);
      setSelectedOptionId("");
      analyticsRef.current?.startPhase(phaseIndex + 1);
      analyticsRef.current?.startQuestion(phaseIndex + 1, 0);
      return;
    }

    if (analyticsRef.current) {
      analyticsRef.current.completeTest();
    }

    onFinish();
  };

  const goToPreviousQuestion = () => {
    if (!allowPreviousQuestion) {
      return;
    }

    completeCurrentQuestion();

    if (questionIndex <= 0) {
      goToPreviousPhase(true);
      return;
    }

    setQuestionIndex(questionIndex - 1);
    setSelectedOptionId("");
    analyticsRef.current?.startQuestion(phaseIndex, questionIndex - 1);
  };

  const goToNextQuestion = (onFinish: () => void) => {
    if (!selectedOptionId && !allowSkipQuestion) {
      return;
    }

    completeCurrentQuestion();

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOptionId("");
      analyticsRef.current?.startQuestion(phaseIndex, questionIndex + 1);
      return;
    }

    goToNextPhase(onFinish);
  };

  const handleOptionClick = (id: string) => {
    if (id !== selectedOptionId) {
      analyticsRef.current?.recordOptionDeselection();
    } else {
      const selectedOption = options.find((o) => o.id === id);
      if (selectedOption) {
        analyticsRef.current?.recordOptionSelection(id, selectedOption.correct);
      }
    }

    setSelectedOptionId((v) => (v === id ? "" : id));
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
  };
}
