export type Summary = {
  averageAccuracy: number;
  averageTimeTaken: number;
  totalQuestionsAnswered: number;
  users: UserSummary[];
};

export type UserSummary = {
  id: string;
  name: string;
  email?: string;
  age?: number;
  group: string;
  timestamp: number;
  timeTaken: number;
  correctQuestions: number;
  questionsAnswered: number;
  accuracy: number;
};
