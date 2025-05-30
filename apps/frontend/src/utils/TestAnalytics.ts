// Clase y utilidades para el tracking de analítica del test

// Tipos para las interacciones y resultados
export type InteractionType =
  | "view" // Visualización de una pregunta
  | "select" // Selección de una opción
  | "change" // Cambio de selección
  | "next" // Siguiente pregunta
  | "previous"; // Pregunta anterior

// Métricas de cada pregunta
export interface QuestionMetrics {
  phaseIndex: number;
  questionIndex: number;
  startTime: number;
  endTime?: number;
  timeTaken?: number;
  selectedOption?: string;
  isCorrect?: boolean;
  optionChanges: number;
}

// Resultados completos del test
export interface TestResults {
  participantId: string;
  groupName: string;
  startTime: number;
  endTime?: number;
  totalTime?: number;
  questions: QuestionMetrics[];
  totalCorrect: number;
  metadata: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    timestamp: number;
  };
}

/**
 * Clase principal para el tracking de analítica del test.
 * Permite registrar el inicio y fin de preguntas, cambios de opción, y resultados.
 */
export class TestAnalytics {
  private results: TestResults;
  private currentPhase: number = 0;
  private currentQuestion: number = 0;

  /**
   * Inicializa la analítica para un grupo y protocolo.
   * @param groupName Nombre del grupo experimental
   * @param protocolName Nombre del protocolo
   */
  constructor(groupName: string) {
    const now = Date.now();
    this.results = {
      participantId: `user_${now.toString().slice(-6)}`,
      groupName,
      startTime: now,
      questions: [],
      totalCorrect: 0,
      metadata: {
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        timestamp: now,
      },
    };
  }

  /**
   * Inicia el tracking de una nueva pregunta.
   * Si ya existe, actualiza el startTime si no ha sido completada.
   */
  startQuestion(phaseIndex: number, questionIndex: number): void {
    const now = Date.now();
    this.currentPhase = phaseIndex;
    this.currentQuestion = questionIndex;
    const existingIndex = this.results.questions.findIndex(
      (q) => q.phaseIndex === phaseIndex && q.questionIndex === questionIndex
    );
    if (existingIndex >= 0) {
      const existing = this.results.questions[existingIndex];
      if (!existing.endTime) {
        this.results.questions[existingIndex].startTime = now;
      }
    } else {
      this.results.questions.push({
        phaseIndex,
        questionIndex,
        startTime: now,
        optionChanges: 0,
      });
    }
  }

  /**
   * Devuelve el objeto de métricas de la pregunta actual.
   */
  private getCurrentQuestion(): QuestionMetrics | null {
    const questionIndex = this.results.questions.findIndex(
      (q) =>
        q.phaseIndex === this.currentPhase &&
        q.questionIndex === this.currentQuestion
    );
    if (questionIndex >= 0) {
      return this.results.questions[questionIndex];
    }
    return null;
  }

  /**
   * Registra un cambio de opción en la pregunta actual.
   */
  recordOptionChange(): void {
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      currentQuestion.optionChanges++;
    }
  }

  /**
   * Completa la pregunta actual y registra el resultado.
   * @param selectedOption Opción seleccionada
   * @param isCorrect Si la respuesta es correcta
   */
  completeQuestion(selectedOption: string, isCorrect: boolean): void {
    const now = Date.now();
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      currentQuestion.endTime = now;
      currentQuestion.timeTaken = now - currentQuestion.startTime;
      currentQuestion.selectedOption = selectedOption;
      currentQuestion.isCorrect = isCorrect;
      if (isCorrect) {
        this.results.totalCorrect++;
      }
    }
  }

  /**
   * Marca el test como completado y devuelve los resultados.
   */
  completeTest(): TestResults {
    const now = Date.now();
    this.results.endTime = now;
    this.results.totalTime = now - this.results.startTime;
    return this.getResults();
  }

  /**
   * Devuelve una copia de los resultados actuales.
   */
  getResults(): TestResults {
    return structuredClone(this.results);
  }

  /**
   * Permite establecer el ID del participante (por ejemplo, desde los datos del estudiante).
   */
  setParticipantId(id: string): void {
    if (id) {
      this.results.participantId = id;
    }
  }
}

// Función utilitaria para guardar resultados en localStorage
export function saveResultsToStorage(results: TestResults): void {
  try {
    const key = `test_${results.participantId}`;
    localStorage.setItem(key, JSON.stringify(results));
  } catch (error) {
    console.error("Error saving results to localStorage:", error);
  }
}

// Función utilitaria para guardar datos del estudiante en localStorage
export function saveStudentDataToStorage(
  participantId: string,
  data: unknown
): void {
  try {
    const key = `student_data_${participantId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving student data to localStorage:", error);
  }
}
