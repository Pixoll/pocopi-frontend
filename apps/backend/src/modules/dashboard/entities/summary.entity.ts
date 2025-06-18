import { UserSummary } from "./user-summary.entity";

export class Summary {
    /**
     * The average accuracy of the users' answers.
     *
     * @example 67.89
     */
    public declare averageAccuracy: number;

    /**
     * The average time taken (in milliseconds) to complete the tese.
     *
     * @example 241356
     */
    public declare averageTimeTaken: number;

    /**
     * Total number of questions that have been answered.
     *
     * @example 123
     */
    public declare totalQuestionsAnswered: number;

    /**
     * Summary for each user that has answered the test.
     */
    public declare users: UserSummary[];
}
