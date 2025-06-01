import { IsIn, Min } from "class-validator";

export enum TimelogEventType {
    DESELECT = "deselect",
    HOVER = "hover",
    SELECT = "select",
}

export class TimelogEventDto {
    @IsIn(Object.values(TimelogEventType))
    public declare type: TimelogEventType;

    @Min(1)
    public declare optionId: number;

    @Min(0)
    public declare timestamp: number;
}
