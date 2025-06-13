import { IsIn, IsInt, IsString, Min } from "class-validator";

export enum TimelogEventType {
    DESELECT = "deselect",
    HOVER = "hover",
    SELECT = "select",
}

export class TimelogEventDto {
    @IsIn(Object.values(TimelogEventType))
    @IsString()
    public declare type: TimelogEventType;

    @Min(1)
    @IsInt()
    public declare optionId: number;

    @Min(0)
    @IsInt()
    public declare timestamp: number;
}
