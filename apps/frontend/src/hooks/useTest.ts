// Hook personalizado para manejar la lógica del test
// Separa la lógica de navegación, selección y analítica del componente principal

import { StudentData } from "@/types/student";
import { TestAnalytics, saveResultsToStorage, saveStudentDataToStorage, } from "@/utils/TestAnalytics.ts";
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
  options: Option[];
  optionsColumns: number;
  progressPercentage: number;
  totalPhaseQuestions: number;
  allowPreviousPhase: boolean;
  allowSkipPhase: boolean;
  allowPreviousQuestion: boolean;
  allowSkipQuestion: boolean;
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

  // Inicializa la analítica y el primer tracking al montar
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
    analyticsRef.current.startQuestion(0, 0);
  }, [group, studentData]);

  const { phases, allowPreviousPhase, allowSkipPhase } = group.protocol;
  const { questions, allowPreviousQuestion, allowSkipQuestion } = phases[phaseIndex];
  const { text: questionText, image: questionImage, options: tempOptions } = questions[questionIndex];

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
      analyticsRef.current.completeQuestion(
        selectedOptionId,
        selectedOption.correct
      );
    }
  };

  const goToPreviousPhase = () => {
    if (!allowPreviousPhase || phaseIndex <= 0) {
      return;
    }

    completeCurrentQuestion();
    setSelectedOptionId("");
    setQuestionIndex(0);
    setPhaseIndex(phaseIndex - 1);
    analyticsRef.current?.startQuestion(phaseIndex - 1, 0);
  };

  const goToNextPhase = (onFinish: () => void) => {
    if (!selectedOptionId && !allowSkipPhase) {
      return;
    }

    completeCurrentQuestion();

    if (phaseIndex < phases.length - 1) {
      setSelectedOptionId("");
      setQuestionIndex(0);
      setPhaseIndex(phaseIndex + 1);
      analyticsRef.current?.startQuestion(phaseIndex + 1, 0);
      return;
    }

    // Completa el test
    if (analyticsRef.current) {
      const results = analyticsRef.current.completeTest();
      saveResultsToStorage(results);
    }

    onFinish();
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

    setSelectedOptionId("");
    setQuestionIndex(questionIndex - 1);
    analyticsRef.current?.startQuestion(phaseIndex, questionIndex - 1);
  };

  const goToNextQuestion = (onFinish: () => void) => {
    if (!selectedOptionId && !allowSkipQuestion) {
      return;
    }

    completeCurrentQuestion();

    if (questionIndex < questions.length - 1) {
      setSelectedOptionId("");
      setQuestionIndex(questionIndex + 1);
      analyticsRef.current?.startQuestion(phaseIndex, questionIndex + 1);
      return;
    }

    goToNextPhase(onFinish);
  };

  const handleOptionClick = (id: string) => {
    if (analyticsRef.current && id !== selectedOptionId) {
      analyticsRef.current.recordOptionChange();
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
    allowPreviousPhase,
    allowSkipPhase,
    allowPreviousQuestion,
    allowSkipQuestion,
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    handleOptionClick,
  };
}
