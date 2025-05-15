export type InteractionType =
  | "view" // Viewing a question
  | "select" // Selecting an option
  | "change" // Changing option selection
  | "next" // Moving to next question
  | "previous"; // Moving to previous question

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

export class RavenAnalytics {
  private results: TestResults;
  private currentPhase: number = 0;
  private currentQuestion: number = 0;

  constructor(groupName: string) {
    const now = Date.now();
    console.log(
      "Initializing simplified RavenAnalytics with group:",
      groupName
    );

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

  // Start tracking a new question
  startQuestion(phaseIndex: number, questionIndex: number): void {
    const now = Date.now();
    this.currentPhase = phaseIndex;
    this.currentQuestion = questionIndex;

    console.log(
      `Starting question tracking: Phase ${phaseIndex}, Question ${questionIndex}`
    );

    // Check if this question already exists in the results
    const existingIndex = this.results.questions.findIndex(
      (q) => q.phaseIndex === phaseIndex && q.questionIndex === questionIndex
    );

    // If it exists, update only the start time
    if (existingIndex >= 0) {
      const existing = this.results.questions[existingIndex];
      // If the question wasn't completed previously, we reset it
      if (!existing.endTime) {
        this.results.questions[existingIndex].startTime = now;
      }
    } else {
      // Create a new record for this question
      this.results.questions.push({
        phaseIndex,
        questionIndex,
        startTime: now,
        optionChanges: 0,
      });
    }
  }

  // Get current question metrics object
  private getCurrentQuestion(): QuestionMetrics | null {
    const questionIndex = this.results.questions.findIndex(
      (q) =>
        q.phaseIndex === this.currentPhase &&
        q.questionIndex === this.currentQuestion
    );

    if (questionIndex >= 0) {
      return this.results.questions[questionIndex];
    }

    console.warn(
      "Could not find current question in results:",
      this.currentPhase,
      this.currentQuestion
    );
    return null;
  }

  // Record option change
  recordOptionChange(): void {
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      currentQuestion.optionChanges++;
    }
  }

  // Complete a question and record result
  completeQuestion(selectedOption: string, isCorrect: boolean): void {
    const now = Date.now();

    console.log(
      `Completing question: Phase ${this.currentPhase}, Question ${this.currentQuestion}`
    );
    console.log(`Selected: ${selectedOption}, Correct: ${isCorrect}`);

    // Find the current question in results
    const currentQuestion = this.getCurrentQuestion();

    if (currentQuestion) {
      // Update question metrics
      currentQuestion.endTime = now;
      currentQuestion.timeTaken = now - currentQuestion.startTime;
      currentQuestion.selectedOption = selectedOption;
      currentQuestion.isCorrect = isCorrect;

      // Update correctness counters
      if (isCorrect) {
        this.results.totalCorrect++;
      }

      console.log("Question completed successfully");
    } else {
      console.error(
        "Failed to complete question - question not found in results"
      );
    }
  }

  // Complete the test
  completeTest(): TestResults {
    const now = Date.now();
    this.results.endTime = now;
    this.results.totalTime = now - this.results.startTime;

    console.log("Completing test. Total time:", this.results.totalTime, "ms");
    return this.getResults();
  }

  // Get current results
  getResults(): TestResults {
    return structuredClone(this.results);
  }

  // Set participant ID (e.g., from student data)
  setParticipantId(id: string): void {
    if (id) {
      this.results.participantId = id;
    }
  }
}

// Function to save data to localStorage
export function saveResultsToStorage(results: TestResults): void {
  try {
    const key = `raven_test_${results.participantId}`;
    const dataString = JSON.stringify(results);
    localStorage.setItem(key, dataString);
    console.log(`Results saved to localStorage with key: ${key}`);
  } catch (error) {
    console.error("Error saving results to localStorage:", error);
  }
}

// Function to save student data to localStorage
export function saveStudentDataToStorage(
  participantId: string,
  data: unknown
): void {
  try {
    const key = `student_data_${participantId}`;
    const dataString = JSON.stringify(data);
    localStorage.setItem(key, dataString);
    console.log(`Student data saved to localStorage with key: ${key}`);
  } catch (error) {
    console.error("Error saving student data to localStorage:", error);
  }
}
