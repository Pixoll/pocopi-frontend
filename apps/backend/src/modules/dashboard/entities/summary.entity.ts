import { UserSummary } from "./user-summary.entity";

export class Summary {
    public declare averageAccuracy: number;
    public declare averageTimeTaken: number;
    public declare totalQuestionsAnswered: number;
    public declare users: UserSummary[];
}
