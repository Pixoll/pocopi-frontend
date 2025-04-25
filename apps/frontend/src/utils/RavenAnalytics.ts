// apps/frontend/src/utils/RavenAnalytics.ts
export type InteractionType =
  | "view" // Viewing a question
  | "select" // Selecting an option
  | "deselect" // Deselecting an option
  | "change" // Changing option selection
  | "next" // Moving to next question
  | "previous" // Moving to previous question
  | "nextPhase" // Moving to next phase
  | "prevPhase" // Moving to previous phase
  | "mousemove" // Mouse movement
  | "hover"; // Hovering over option

export interface Position {
  x: number;
  y: number;
}

export interface Interaction {
  type: InteractionType;
  timestamp: number;
  phaseIndex: number;
  questionIndex: number;
  optionId?: string;
  correct?: boolean;
  position?: Position; // Mouse position for movement tracking
  duration?: number; // Duration for hover events
}

export interface AttentionLapse {
  start: number;
  end: number;
  duration: number;
}

export interface Hesitation {
  timestamp: number;
  duration: number;
  beforeAction: InteractionType;
}

export interface MouseTrack {
  path: Position[];
  startTime: number;
  endTime: number;
}

export interface QuestionMetrics {
  phaseIndex: number;
  questionIndex: number;
  startTime: number;
  endTime?: number;
  timeTaken?: number;
  initialResponseTime?: number; // Time until first interaction
  selectedOption?: string;
  isCorrect?: boolean;
  interactions: Interaction[];
  optionChanges: number;
  attentionLapses: AttentionLapse[];
  hesitations: Hesitation[];
  mouseTrack?: MouseTrack;
  hoverPattern: { [optionId: string]: number }; // Time spent hovering over each option
  confidenceScore?: number; // Calculated based on response time and changes
}

export interface TestResults {
  participantId: string;
  groupName: string;
  protocolName: string;
  startTime: number;
  endTime?: number;
  totalTime?: number;
  questions: QuestionMetrics[];
  totalCorrect: number;
  errorPattern?: {
    consecutiveErrors: number;
    errorsByPhase: { [phase: number]: number };
    errorsByType: { [pattern: string]: number };
  };
  learningCurve?: {
    timeProgressionByPhase: number[];
    accuracyProgressionByPhase: number[];
  };
  metadata: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    devicePixelRatio: number;
    language: string;
    timestamp: number;
  };
}

export class RavenAnalytics {
  private results: TestResults;
  private currentPhase: number = 0;
  private currentQuestion: number = 0;
  private lastInteractionTime: number = 0;
  private lastMousePosition: Position = { x: 0, y: 0 };
  private mouseTrackBuffer: Position[] = [];
  private mouseTrackInterval: number | null = null;

  // Thresholds for detection
  private readonly ATTENTION_LAPSE_THRESHOLD = 5000; // 5 seconds
  private readonly HESITATION_THRESHOLD = 3000; // 3 seconds
  private readonly CONFIDENCE_THRESHOLD_HIGH = 2000; // Fast response = high confidence
  private readonly CONFIDENCE_THRESHOLD_LOW = 8000; // Slow response = low confidence
  private readonly MOUSE_TRACK_INTERVAL = 100; // Collect mouse position every 100ms

  constructor(groupName: string, protocolName: string) {
    const now = Date.now();
    console.log(
      "Initializing RavenAnalytics with group:",
      groupName,
      "protocol:",
      protocolName
    );

    this.results = {
      participantId: `user_${now.toString().slice(-6)}`,
      groupName,
      protocolName,
      startTime: now,
      questions: [],
      totalCorrect: 0,
      errorPattern: {
        consecutiveErrors: 0,
        errorsByPhase: {},
        errorsByType: {},
      },
      learningCurve: {
        timeProgressionByPhase: [],
        accuracyProgressionByPhase: [],
      },
      metadata: {
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        language: navigator.language,
        timestamp: now,
      },
    };

    this.lastInteractionTime = now;
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
        interactions: [],
        optionChanges: 0,
        attentionLapses: [],
        hesitations: [],
        hoverPattern: {},
      });
    }

    // Record the view interaction
    this.recordInteraction("view");
    this.lastInteractionTime = now;

    // Start tracking mouse movements
    this.startMouseTracking();
  }

  // Start collecting mouse position data
  private startMouseTracking(): void {
    // Clear any existing tracking
    if (this.mouseTrackInterval !== null) {
      window.clearInterval(this.mouseTrackInterval);
    }

    this.mouseTrackBuffer = [];
    const startTime = Date.now();

    // Set up interval to collect mouse positions
    this.mouseTrackInterval = window.setInterval(() => {
      if (this.mouseTrackBuffer.length > 0) {
        const currentQuestion = this.getCurrentQuestion();
        if (currentQuestion) {
          currentQuestion.mouseTrack = {
            path: [...this.mouseTrackBuffer],
            startTime,
            endTime: Date.now(),
          };
        }
      }
    }, 1000); // Update stored track every second
  }

  // Stop collecting mouse position data
  private stopMouseTracking(): void {
    if (this.mouseTrackInterval !== null) {
      window.clearInterval(this.mouseTrackInterval);
      this.mouseTrackInterval = null;
    }
  }

  // Record mouse position
  recordMouseMove(x: number, y: number): void {
    const now = Date.now();
    const newPosition = { x, y };

    // Calculate movement distance
    const distance = Math.sqrt(
      Math.pow(newPosition.x - this.lastMousePosition.x, 2) +
        Math.pow(newPosition.y - this.lastMousePosition.y, 2)
    );

    // Only record if the mouse has moved significantly
    if (distance > 10) {
      this.lastMousePosition = newPosition;
      this.mouseTrackBuffer.push(newPosition);

      // Record the interaction
      this.recordInteraction("mousemove", undefined, undefined, newPosition);
      this.lastInteractionTime = now;
    }
  }

  // Record hover over an option
  recordHover(optionId: string, duration: number): void {
    // Record the interaction
    this.recordInteraction("hover", optionId, undefined, undefined, duration);

    // Update hover pattern
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      if (!currentQuestion.hoverPattern[optionId]) {
        currentQuestion.hoverPattern[optionId] = 0;
      }
      currentQuestion.hoverPattern[optionId] += duration;
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

  // Record a user interaction
  recordInteraction(
    type: InteractionType,
    optionId?: string,
    correct?: boolean,
    position?: Position,
    duration?: number
  ): void {
    const now = Date.now();
    const timeSinceLastInteraction = now - this.lastInteractionTime;

    // Create interaction object
    const interaction: Interaction = {
      type,
      timestamp: now,
      phaseIndex: this.currentPhase,
      questionIndex: this.currentQuestion,
      optionId,
      correct,
      position,
      duration,
    };

    // Find the current question in results
    const currentQuestion = this.getCurrentQuestion();

    if (currentQuestion) {
      // If this is the first interaction (other than view), record initial response time
      if (
        type !== "view" &&
        type !== "mousemove" &&
        !currentQuestion.initialResponseTime &&
        currentQuestion.interactions.filter(
          (i) => i.type !== "view" && i.type !== "mousemove"
        ).length === 0
      ) {
        currentQuestion.initialResponseTime = now - currentQuestion.startTime;
      }

      // Detect attention lapses (periods without interaction)
      if (timeSinceLastInteraction > this.ATTENTION_LAPSE_THRESHOLD) {
        currentQuestion.attentionLapses.push({
          start: this.lastInteractionTime,
          end: now,
          duration: timeSinceLastInteraction,
        });
      }

      // Detect hesitations
      if (
        timeSinceLastInteraction > this.HESITATION_THRESHOLD &&
        type !== "mousemove" &&
        type !== "view"
      ) {
        currentQuestion.hesitations.push({
          timestamp: now,
          duration: timeSinceLastInteraction,
          beforeAction: type,
        });
      }

      // Detect option changes
      if (type === "change") {
        currentQuestion.optionChanges++;
      }

      // Store the interaction
      currentQuestion.interactions.push(interaction);
    } else {
      console.warn(
        "Trying to record interaction but current question not found:",
        {
          phase: this.currentPhase,
          question: this.currentQuestion,
          type,
        }
      );
    }

    this.lastInteractionTime = now;
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

      // Calculate confidence score based on response time and changes
      const responseTime = currentQuestion.timeTaken;
      const normResponseTime = Math.min(
        1.0,
        Math.max(
          0.0,
          (this.CONFIDENCE_THRESHOLD_LOW - responseTime) /
            (this.CONFIDENCE_THRESHOLD_LOW - this.CONFIDENCE_THRESHOLD_HIGH)
        )
      );

      const changesFactor = Math.max(
        0,
        1 - currentQuestion.optionChanges * 0.2
      );
      currentQuestion.confidenceScore =
        (normResponseTime * 0.7 + changesFactor * 0.3) * 100;

      // Record final interaction
      this.recordInteraction("next", selectedOption, isCorrect);

      // Update correctness counters
      if (isCorrect) {
        this.results.totalCorrect++;
        // Reset consecutive errors
        this.results.errorPattern!.consecutiveErrors = 0;
      } else {
        // Increment consecutive errors
        this.results.errorPattern!.consecutiveErrors++;

        // Record error by phase
        if (!this.results.errorPattern!.errorsByPhase[this.currentPhase]) {
          this.results.errorPattern!.errorsByPhase[this.currentPhase] = 0;
        }
        this.results.errorPattern!.errorsByPhase[this.currentPhase]++;

        // Analyze and record error pattern
        this.analyzeErrorPattern(currentQuestion);
      }

      // Stop mouse tracking for this question
      this.stopMouseTracking();

      console.log("Question completed successfully");
    } else {
      console.error(
        "Failed to complete question - question not found in results"
      );
    }
  }

  // Analyze the error pattern for a question
  private analyzeErrorPattern(question: QuestionMetrics): void {
    // This is a simplified implementation - in a real system, you would
    // analyze the specific matrix pattern and the chosen incorrect answer
    // to determine what type of reasoning error occurred

    // For now, we use a simple approximation based on response time
    const responseTime = question.timeTaken || 0;

    let errorType = "unknown";
    if (responseTime < 3000) {
      errorType = "hasty-error"; // User responded too quickly
    } else if (responseTime > 15000) {
      errorType = "confusion-error"; // User seemed confused
    } else if (question.optionChanges > 2) {
      errorType = "indecision-error"; // User changed their mind multiple times
    } else if (question.attentionLapses.length > 0) {
      errorType = "attention-error"; // User had attention lapses
    }

    if (!this.results.errorPattern!.errorsByType[errorType]) {
      this.results.errorPattern!.errorsByType[errorType] = 0;
    }
    this.results.errorPattern!.errorsByType[errorType]++;
  }

  // Update learning curve data when a phase is completed
  updateLearningCurve(phaseIndex: number): void {
    // Calculate average time and accuracy for this phase
    const phaseQuestions = this.results.questions.filter(
      (q) => q.phaseIndex === phaseIndex && q.endTime !== undefined
    );

    console.log(
      `Updating learning curve for phase ${phaseIndex} with ${phaseQuestions.length} questions`
    );

    if (phaseQuestions.length > 0) {
      const totalTime = phaseQuestions.reduce(
        (sum, q) => sum + (q.timeTaken || 0),
        0
      );
      const avgTime = totalTime / phaseQuestions.length;

      const correctCount = phaseQuestions.filter((q) => q.isCorrect).length;
      const accuracy = (correctCount / phaseQuestions.length) * 100;

      if (!this.results.learningCurve!.timeProgressionByPhase) {
        this.results.learningCurve!.timeProgressionByPhase = [];
      }

      if (!this.results.learningCurve!.accuracyProgressionByPhase) {
        this.results.learningCurve!.accuracyProgressionByPhase = [];
      }

      this.results.learningCurve!.timeProgressionByPhase[phaseIndex] = avgTime;
      this.results.learningCurve!.accuracyProgressionByPhase[phaseIndex] =
        accuracy;

      console.log(
        `Learning curve updated - Phase ${phaseIndex}: Avg time ${avgTime}ms, Accuracy ${accuracy}%`
      );
    }
  }

  // Complete the test
  completeTest(): TestResults {
    const now = Date.now();
    this.results.endTime = now;
    this.results.totalTime = now - this.results.startTime;

    console.log("Completing test. Total time:", this.results.totalTime, "ms");

    // Ensure learning curve data is complete
    for (let i = 0; i <= this.currentPhase; i++) {
      this.updateLearningCurve(i);
    }

    return this.getResults();
  }

  // Get current results
  getResults(): TestResults {
    return structuredClone(this.results);
  }

  // Export results as JSON
  exportToJSON(): string {
    return JSON.stringify(this.results, null, 2);
  }

  // Calculate summary statistics
  getSummaryStats(): any {
    const completedQuestions = this.results.questions.filter(
      (q) => q.endTime !== undefined
    );
    const totalQuestions = completedQuestions.length;

    console.log(
      `Calculating summary stats for ${totalQuestions} completed questions`
    );

    if (totalQuestions === 0) {
      return {
        totalTime: 0,
        averageTimePerQuestion: 0,
        totalCorrect: 0,
        correctPercentage: 0,
        totalOptionChanges: 0,
        averageOptionChanges: 0,
        averageConfidence: 0,
      };
    }

    const totalTime = this.results.totalTime || 0;
    const correctAnswers = completedQuestions.filter((q) => q.isCorrect).length;
    const totalOptionChanges = completedQuestions.reduce(
      (sum, q) => sum + q.optionChanges,
      0
    );
    const totalConfidence = completedQuestions.reduce(
      (sum, q) => sum + (q.confidenceScore || 0),
      0
    );

    const stats = {
      totalTime,
      averageTimePerQuestion: totalTime / totalQuestions,
      totalCorrect: correctAnswers,
      correctPercentage: (correctAnswers / totalQuestions) * 100,
      totalOptionChanges,
      averageOptionChanges: totalOptionChanges / totalQuestions,
      averageConfidence: totalConfidence / totalQuestions,
      totalHesitations: completedQuestions.reduce(
        (sum, q) => sum + q.hesitations.length,
        0
      ),
      totalAttentionLapses: completedQuestions.reduce(
        (sum, q) => sum + q.attentionLapses.length,
        0
      ),
      errorPatterns: this.results.errorPattern?.errorsByType || {},
      learningProgression: {
        accuracy: this.results.learningCurve?.accuracyProgressionByPhase || [],
        time: this.results.learningCurve?.timeProgressionByPhase || [],
      },
    };

    console.log("Summary stats calculated:", stats);
    return stats;
  }
}

// Function to save data to localStorage
export function saveResultsToStorage(results: TestResults): void {
  try {
    const key = `raven_test_${results.participantId}`;
    const dataString = JSON.stringify(results);
    localStorage.setItem(key, dataString);
    console.log(`Results saved to localStorage with key: ${key}`);
    console.log(`Data size: ${dataString.length} characters`);

    // Verify the save worked
    const savedData = localStorage.getItem(key);
    if (savedData) {
      console.log("Verification successful - data was saved");
    } else {
      console.error("Verification failed - data was not saved correctly");
    }
  } catch (error) {
    console.error("Error saving results to localStorage:", error);
  }
}

// Function to upload data to server (simulated)
export function uploadResults(results: TestResults): Promise<Response> {
  // This function should be implemented to send data to your backend
  // Here we just simulate an upload
  console.log("Sending results to server...", results);

  // Simulate a fetch request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    }, 500);
  });
}
