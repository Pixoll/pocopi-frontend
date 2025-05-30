// Hook personalizado para manejar la lógica del test de matrices de Raven
import { useState, useRef, useEffect } from "react";
import {
  RavenAnalytics,
  saveStudentDataToStorage,
} from "@/utils/RavenAnalytics";
import { Group } from "@pocopi/config";

interface StudentData {
  name: string;
  id: string;
  email: string;
  age: string;
}

export function useRavenMatrixTest(
  group: Group,
  studentData: StudentData | null
) {
  const [phase, setPhase] = useState(0);
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState("");
  const analyticsRef = useRef<RavenAnalytics | null>(null);
  
  useEffect(() => {
    analyticsRef.current = new RavenAnalytics(group.label);
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
  
  const { phases } = group.protocol;
  const { questions } = phases[phase];
  const { text: questionText, image: questionImage, options: tempOptions } = questions[question];
  
  const options = tempOptions.map((option) => {
    const id = option.image?.src ?? option.text!;
    return {
      ...option,
      id,
      isCorrect: option.correct,
    };
  });
  
  const optionsColumns = Math.ceil(options.length / 2);
  
  const totalQuestions = phases.reduce(
    (acc, phase) => acc + phase.questions.length,
    0
  );
  const currentQuestionNumber =
    phases
    .slice(0, phase)
    .reduce(
      (acc, phase) => acc + phase.questions.length,
      0
    ) +
    question +
    1;
  const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;
  
  const completeCurrentQuestion = () => {
    if (!analyticsRef.current) return;
    analyticsRef.current.completeQuestion();
  };
  
  const goToPreviousPhase = () => {
    if (phase <= 0) return;
    completeCurrentQuestion();
    analyticsRef.current?.completePhase(phase);
    setSelected("");
    setQuestion(0);
    setPhase(phase - 1);
    analyticsRef.current?.startPhase(phase - 1);
    analyticsRef.current?.startQuestion(phase - 1, 0);
  };
  
  const goToNextPhase = (onFinish: () => void) => {
    completeCurrentQuestion();
    analyticsRef.current?.completePhase(phase);
    if (phase < phases.length - 1) {
      setSelected("");
      setQuestion(0);
      setPhase(phase + 1);
      analyticsRef.current?.startPhase(phase + 1);
      analyticsRef.current?.startQuestion(phase + 1, 0);
      return;
    }
    if (analyticsRef.current) {
       analyticsRef.current.completeTest();
    }
    onFinish();
  };
  
  const goToPreviousQuestion = () => {
    completeCurrentQuestion();
    if (question <= 0) {
      goToPreviousPhase();
      return;
    }
    setSelected("");
    setQuestion(question - 1);
    analyticsRef.current?.startQuestion(phase, question - 1);
  };
  
  const goToNextQuestion = (onFinish: () => void) => {
    completeCurrentQuestion();
    if (question < questions.length - 1) {
      setSelected("");
      setQuestion(question + 1);
      analyticsRef.current?.startQuestion(phase, question + 1);
      return;
    }
    goToNextPhase(onFinish);
  };
  
  const handleOptionClick = (id: string) => {
    if (!analyticsRef.current) return;
    
    const alreadySelected = selected === id;
    if (alreadySelected) {
      // Deselección
      analyticsRef.current.recordOptionDeselection();
      setSelected("");
    } else {
      const selectedOption = options.find((o) => o.id === id);
      if (selectedOption) {
        analyticsRef.current.recordOptionSelection(id, selectedOption.isCorrect);
        setSelected(id);
      }
    }
  };
  
  return {
    phase,
    setPhase,
    question,
    setQuestion,
    selected,
    setSelected,
    questionText,
    questionImage,
    options,
    optionsColumns,
    progressPercentage,
    questions,
    totalQuestions,
    currentQuestionNumber,
    goToPreviousPhase,
    goToNextPhase,
    goToPreviousQuestion,
    goToNextQuestion,
    handleOptionClick,
  };
}
