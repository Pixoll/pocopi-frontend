import { TimelogEvent } from "./timelog-event.entity";

export class Timelog {
    /**
     * The ID of the user.
     *
     * @example "12.345.678-9"
     */
    public declare userId: string;

    /**
     * The ID of the test phase.
     *
     * @example 1
     */
    public declare phaseId: number;

    /**
     * The ID of the test question with respect to the phase ID.
     *
     * @example 2
     */
    public declare questionId: number;

    /**
     * Timestamp at which the timelog began recording.
     *
     * @example 1750270941600
     */
    public declare startTimestamp: number;

    /**
     * Timestamp at which the timelog stopped recording.
     *
     * @example 1750270950951
     */
    public declare endTimestamp: number;

    /**
     * Whether the user responded correctly.
     *
     * @example true
     */
    public declare correct: boolean;

    /**
     * Whether the question was skipped.
     *
     * @example false
     */
    public declare skipped: boolean;

    /**
     * How many times the user changed the selected option before sending/skipping.
     *
     * @example 0
     */
    public declare totalOptionChanges: number;

    /**
     * How many options the user hovered the mouse on.
     *
     * @example 1
     */
    public declare totalOptionHovers: number;

    /**
     * List of events recorded.
     */
    public declare events: TimelogEvent[];
}
