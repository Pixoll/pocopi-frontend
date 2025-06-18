export class User {
    /**
     * Whether the user is anonymous or not.
     *
     * @example false
     */
    public declare anonymous: boolean;

    /**
     * The ID of the user.
     *
     * @example "12.345.678-9"
     */
    public declare id: string;

    /**
     * The test group that was assigned to this user.
     *
     * @example "control"
     */
    public declare group: string;

    /**
     * The real name of the user. Required if not an anon. user.
     *
     * @example "John"
     */
    public declare name?: string;

    /**
     * The email of the user. Required if not an anon. user.
     *
     * @example "john@email.com"
     */
    public declare email?: string;

    /**
     * The age of the user. Required if not an anon. user.
     *
     * @example 21
     */
    public declare age?: number;
}
