export class UserSummary {
    /**
     * The ID of the user.
     *
     * @example "12.345.678-9"
     */
    public declare id: string;

    /**
     * The real name of the user. "Anonymous" if it's an anon. user.
     *
     * @example "John"
     */
    public declare name: string;

    /**
     * The email of the user. Only present if it's not an anon. user.
     *
     * @example "john@email.com"
     */
    public declare email?: string;

    /**
     * The age of the user. Only present if it's not an anon. user.
     *
     * @example 21
     */
    public declare age?: number;

    /**
     * The test group that was assigned to this user.
     *
     * @example "control"
     */
    public declare group: string;

    /**
     * Timestamp at which the user started the test.
     *
     * @example 1750268846571
     */
    public declare timestamp: number;

    /**
     * Total time taken (in milliseconds) by the user to complete the test.
     *
     * @example 93567
     */
    public declare timeTaken: number;

    /**
     * Number of correctly answered questions.
     *
     * @example 30
     */
    public declare correctQuestions: number;

    /**
     * Total number of questions answered.
     *
     * @example 32
     */
    public declare questionsAnswered: number;

    /**
     * Accuracy of the user's answers.
     *
     * @example 93.75
     */
    public declare accuracy: number;
}
