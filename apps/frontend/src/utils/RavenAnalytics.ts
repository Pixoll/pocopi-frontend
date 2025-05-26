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
  sessionId: string;      // <-- agregado para identificar sesión única de fase
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

export function printPhaseMetrics(phase: PhaseMetrics): void {
  console.log(`--- Phase ${phase.phaseIndex} ---`);
  console.log(`Start Time: ${new Date(phase.startTime).toLocaleString()}`);
  console.log(`End Time: ${phase.endTime ? new Date(phase.endTime).toLocaleString() : 'Still running'}`);
  console.log(`Questions:`);
  
  phase.questions.forEach((question, qIndex) => {
    console.log(`  [Q${qIndex}] Question Index: ${question.questionIndex}`);
    console.log(`    Start Time: ${new Date(question.startTime).toLocaleString()}`);
    console.log(`    End Time: ${question.endTime ? new Date(question.endTime).toLocaleString() : 'Still running'}`);
    console.log(`    Options:`);
    
    question.options.forEach((option, oIndex) => {
      console.log(`      [O${oIndex}] Option Index: ${option.optionIndex}`);
      console.log(`        Is Correct: ${option.isCorrect}`);
      console.log(`        Start Time: ${new Date(option.startTime).toLocaleString()}`);
      console.log(`        End Time: ${option.endTime ? new Date(option.endTime).toLocaleString() : 'Still active'}`);
    });
  });
  
  console.log(`----------------------------`);
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
    const sessionId = `phase_${phaseIndex}_${now}`; // << sesión única
    this.currentPhase = phaseIndex;
    this.currentPhaseSessionId = sessionId;
    
    const newPhase: PhaseMetrics = {
      phaseIndex,
      sessionId,
      startTime: now,
      questions: [],
    };
    
    this.results.phases.push(newPhase);
  }
  
  completePhase(phaseIndex: number): void {
    const now = Date.now();
    const phase = this.results.phases.find(
      p => p.phaseIndex === phaseIndex && p.sessionId === this.currentPhaseSessionId
    );
    if (phase && !phase.endTime) {
      phase.endTime = now;
      printPhaseMetrics(phase);
    }
  }
  
  startQuestion(phaseIndex: number, questionIndex: number): void {
    const now = Date.now();
    this.currentPhase = phaseIndex;
    this.currentQuestion = questionIndex;
    
    const phase = this.results.phases.find(
      p => p.phaseIndex === phaseIndex && p.sessionId === this.currentPhaseSessionId
    );
    
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
  
  completeTest(): TestResults {
    const now = Date.now();
    this.results.endTime = now;
    this.results.totalTime = now - this.results.startTime;
    return structuredClone(this.results);
  }
  
  setParticipantId(id: string): void {
    if (id) {
      this.results.participantId = id;
    }
  }
  
  private getCurrentQuestion(): QuestionMetrics | null {
    const phase = this.results.phases.find(
      p => p.phaseIndex === this.currentPhase && p.sessionId === this.currentPhaseSessionId
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
