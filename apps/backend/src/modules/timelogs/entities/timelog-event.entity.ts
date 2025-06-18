import { TimelogEventType } from "../dtos/timelog-event.dto";

export class TimelogEvent {
    /**
     * The type of the event.
     *
     * @example "hover"
     */
    public declare type: TimelogEventType;

    /**
     * The ID of the option (with respect to the question ID) this event corresponds to.
     *
     * @example 4
     */
    public declare optionId: number;

    /**
     * The timestamp at which this event was triggered.
     *
     * @example 1750270947620
     */
    public declare timestamp: number;
}
