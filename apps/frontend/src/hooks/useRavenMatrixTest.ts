// Hook personalizado para manejar la lógica del test de matrices de Raven
// Separa la lógica de navegación, selección y analítica del componente principal

import { useState, useRef, useEffect } from "react";
import {
  RavenAnalytics,
  saveResultsToStorage,
  saveStudentDataToStorage,
} from "@/utils/RavenAnalytics";
import { config } from "@pocopi/config";

// Tipos para los datos del estudiante y opciones
interface StudentData {
  name: string;
  id: string;
  email: string;
  age: string;
}
interface RavenOption {
  id: string;
  src: string;
  alt: string;
  correct?: boolean;
  isCorrect: boolean;
}
interface RavenPhase {
  questions: Array<{
    img: { src: string; alt: string };
    options: RavenOption[];
  }>;
}

export function useRavenMatrixTest(
  protocol: string,
  studentData: StudentData | null
) {
  // Estado para fase, pregunta y opción seleccionada
  const [phase, setPhase] = useState(0);
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState("");
  const analyticsRef = useRef<RavenAnalytics | null>(null);

  // Inicializa la analítica y el primer tracking al montar
  useEffect(() => {
    analyticsRef.current = new RavenAnalytics("default_group", protocol);
    if (studentData?.id) {
      analyticsRef.current.setParticipantId(studentData.id);
      saveStudentDataToStorage(studentData.id, {
        name: studentData.name,
        email: studentData.email,
        age: studentData.age,
      });
    }
    analyticsRef.current.startQuestion(0, 0);
  }, [protocol, studentData]);

  // Obtiene la estructura de preguntas y opciones
  const { phases } = config.protocols[protocol] as { phases: RavenPhase[] };
  const { questions } = phases[phase];
  const { img, options: tempOptions } = questions[question];

  // Procesa las opciones para agregar id y detectar la correcta
  const options: RavenOption[] = tempOptions.map((option) => {
    const base64 = option.src.split(";")[1]?.slice(7) || option.src;
    const half = Math.round(base64.length / 2);
    const id = base64.substring(half - 10, half + 10);
    return {
      ...option,
      id,
      isCorrect:
        option.correct === true ||
        String(option.correct).toLowerCase() === "true",
    };
  });

  // Cálculo de columnas para el layout
  const optionsColumns = Math.ceil(options.length / 2);

  // Progreso
  const totalQuestions = phases.reduce(
    (acc: number, phase: RavenPhase) => acc + phase.questions.length,
    0
  );
  const currentQuestionNumber =
    phases
      .slice(0, phase)
      .reduce(
        (acc: number, phase: RavenPhase) => acc + phase.questions.length,
        0
      ) +
    question +
    1;
  const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;

  // Completa la pregunta actual en la analítica
  const completeCurrentQuestion = () => {
    if (!selected || !analyticsRef.current) return;
    const selectedOption = options.find((o: RavenOption) => o.id === selected);
    if (selectedOption) {
      analyticsRef.current.completeQuestion(
        selected,
        !!selectedOption.isCorrect
      );
    }
  };

  // Navegación entre fases y preguntas
  const goToPreviousPhase = () => {
    if (phase <= 0) return;
    completeCurrentQuestion();
    setSelected("");
    setQuestion(0);
    setPhase(phase - 1);
    analyticsRef.current?.startQuestion(phase - 1, 0);
  };

  const goToNextPhase = (onFinish: () => void) => {
    completeCurrentQuestion();
    if (phase < phases.length - 1) {
      setSelected("");
      setQuestion(0);
      setPhase(phase + 1);
      analyticsRef.current?.startQuestion(phase + 1, 0);
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

  // Maneja el click en una opción
  const handleOptionClick = (id: string) => {
    if (analyticsRef.current && id !== selected) {
      analyticsRef.current.recordOptionChange();
    }
    setSelected((v) => (v === id ? "" : id));
  };

  return {
    phase,
    setPhase,
    question,
    setQuestion,
    selected,
    setSelected,
    img,
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
