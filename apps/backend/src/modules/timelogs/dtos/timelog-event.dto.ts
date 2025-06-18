import { IsIn, IsInt, IsString, Min } from "class-validator";

export enum TimelogEventType {
    DESELECT = "deselect",
    HOVER = "hover",
    SELECT = "select",
}

export class TimelogEventDto {
    /**
     * The type of the event.
     *
     * @example "hover"
     */
    @IsIn(Object.values(TimelogEventType))
    @IsString()
    public declare type: TimelogEventType;

    /**
     * The ID of the option (with respect to the question ID) this event corresponds to.
     *
     * @example 4
     */
    @Min(1)
    @IsInt()
    public declare optionId: number;

    /**
     * The timestamp at which this event was triggered.
     *
     * @example 1750270947620
     */
    @Min(0)
    @IsInt()
    public declare timestamp: number;
}
