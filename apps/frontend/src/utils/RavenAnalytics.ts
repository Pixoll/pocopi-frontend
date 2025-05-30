export interface OptionMetrics {
  optionIndex: string;
  isCorrect: boolean;
  startTime: number;
  endTime?: number;
}

export interface QuestionMetrics {
  questionIndex: number;
  startTime: number;
  endTime?: number;
  options: OptionMetrics[];
}

export interface PhaseMetrics {
  phaseIndex: number;
  phaseId: string;
  startTime: number;
  endTime?: number;
  questions: QuestionMetrics[];
}

export interface TestResults {
  participantId: string;
  groupName: string;
  startTime: number;
  endTime?: number;
  totalTime?: number;
  totalCorrect: number;
  phases: PhaseMetrics[];
  metadata: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    timestamp: number;
  };
}



export class RavenAnalytics {
  private results: TestResults;
  private currentPhase: number = 0;
  private currentQuestion: number = 0;
  private currentPhaseSessionId: string | null = null; // << NUEVO
  
  constructor(groupName: string) {
    const now = Date.now();
    this.results = {
      participantId: `user_${now.toString().slice(-6)}`,
      groupName,
      startTime: now,
      totalCorrect: 0,
      metadata: {
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        timestamp: now,
      },
      phases: [],
    };
  }
  
  startPhase(phaseIndex: number): void {
    const now = Date.now();
    const sessionId = `phase_${phaseIndex}_${now}`;
    this.currentPhase = phaseIndex;
    this.currentPhaseSessionId = sessionId;
    
    console.log(`\nIniciando fase: ${phaseIndex}\nID: ${this.currentPhaseSessionId}\nInicio: ${now}`);
    
    const newPhase: PhaseMetrics = {
      phaseIndex,
      phaseId: sessionId,
      startTime: now,
      questions: [],
    };
    
    this.results.phases.push(newPhase);
  }
  
  completePhase(phaseIndex: number): void {
    const now = Date.now();
    const phase = this.results.phases.find(p => {
      return p.phaseIndex === phaseIndex && p.phaseId === this.currentPhaseSessionId;
    });
    if (phase && !phase.endTime) {
      phase.endTime = now;
      const questionsVisited = phase.questions.length;
      console.log(
        `Terminando fase: ${phaseIndex}\n` +
        `ID: ${this.currentPhaseSessionId}\n` +
        `Fin: ${now}\n` +
        `Preguntas visitadas: ${questionsVisited}\n`
      );
      
    }
  }
  
  startQuestion(phaseIndex: number, questionIndex: number): void {
    const now = Date.now();
    this.currentPhase = phaseIndex;
    this.currentQuestion = questionIndex;
    console.log(`Pregunta N_: ${questionIndex}, Inicio: ${now}`);
    
    const phase = this.results.phases.find(p => {
      return p.phaseIndex === phaseIndex && p.phaseId === this.currentPhaseSessionId
    });
    
    if (!phase) {
      this.startPhase(phaseIndex);
      return this.startQuestion(phaseIndex, questionIndex);
    }
    
    let question = phase.questions.find(q => q.questionIndex === questionIndex);
    if (!question) {
      question = {
        questionIndex,
        startTime: now,
        options: [],
      };
      phase.questions.push(question);
    } else if (!question.startTime) {
      question.startTime = now;
    }
  }
  
  completeQuestion(): void {
    const now = Date.now();
    const question = this.getCurrentQuestion();
    if (!question) return;
    
    if (!question.endTime) {
      question.endTime = now;
    }
    
    const lastOption = question.options.length > 0 ? question.options[question.options.length - 1] : null;
    if (lastOption && !lastOption.endTime) {
      lastOption.endTime = now;
    }
    console.log(`Finalizando Pregunta N_: ${this.currentQuestion}, Fin: ${now}`);
  }
  
  recordOptionSelection(optionIndex: string, isCorrect: boolean): void {
    const now = Date.now();
    const question = this.getCurrentQuestion();
    if (!question) return;
    
    const lastOption = question.options.length > 0 ? question.options[question.options.length - 1] : null;
    if (lastOption && !lastOption.endTime) {
      lastOption.endTime = now;
    }
    
    question.options.push({
      optionIndex,
      isCorrect,
      startTime: now,
    });
    console.log(
      `Se seleccionó la respuesta: ${optionIndex}. ` +
      (isCorrect ? "¡Es correcta!" : "No es correcta.")
    );
  }
  
  recordOptionDeselection(): void {
    const now = Date.now();
    const question = this.getCurrentQuestion();
    if (!question) return;
    
    for (let i = question.options.length - 1; i >= 0; i--) {
      if (!question.options[i].endTime) {
        question.options[i].endTime = now;
        break;
      }
    }
  }
  
  async completeTest(): Promise<TestResults> {
    const now = Date.now();
    this.results.endTime = now;
    this.results.totalTime = now - this.results.startTime;
    
    const clonedResults = structuredClone(this.results);
    
    console.log("==== RESULTADOS COMPLETOS DEL TEST ====");
    console.log(JSON.stringify(clonedResults, null, 2));
    
    await sendTimelogsToBackend(clonedResults);
    
    return clonedResults;
  }
  
  
  setParticipantId(id: string): void {
    if (id) {
      this.results.participantId = id;
    }
  }
  
  private getCurrentQuestion(): QuestionMetrics | null {
    const phase = this.results.phases.find(
      p => p.phaseIndex === this.currentPhase && p.phaseId === this.currentPhaseSessionId
    );
    if (!phase) return null;
    
    const question = phase.questions.find(q => q.questionIndex === this.currentQuestion);
    return question || null;
  }
  
}

// Función utilitaria para guardar resultados en localStorage
export function saveResultsToStorage(results: TestResults): void {
  try {
    const key = `raven_test_${results.participantId}`;
    localStorage.setItem(key, JSON.stringify(results));
  } catch (error) {
    console.error("Error saving results to localStorage:", error);
  }
}

// Función utilitaria para guardar datos del estudiante en localStorage
export function saveStudentDataToStorage( participantId: string, data: unknown): void {
  try {
    const key = `student_data_${participantId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving student data to localStorage:", error);
  }
}


async function sendTimelogsToBackend(results: TestResults): Promise<void> {
  const allTimelogs = [];
  
  for (const phase of results.phases) {
    for (const question of phase.questions) {
      const timelog = {
        userId: results.participantId,
        phaseId: phase.phaseId,
        questionId: question.questionIndex + 1,
        startTimestamp: question.startTime,
        endTimestamp: question.endTime ?? question.startTime,
        correct: question.options.some(opt => opt.isCorrect),
        skipped: question.options.length === 0,
        totalOptionChanges: question.options.length,
        totalOptionHovers: 0,
        events: question.options.map(opt => ({
          type: "select",
          optionId: parseInt(opt.optionIndex, 10) + 1,
          timestamp: opt.startTime,
        })),
      };
      
      allTimelogs.push(timelog);
    }
  }
  
  for (const log of allTimelogs) {
    try {
      await fetch("http://localhost:3000/api/timelog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
    } catch (error) {
      console.error("Error enviando timelog al backend:", error);
    }
  }
}
