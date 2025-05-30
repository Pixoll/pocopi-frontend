import { TransformToInstance } from "@decorators";
import { IsArray, IsBoolean, Min, MinLength, ValidateNested } from "class-validator";
import { TimelogEventDto } from "./timelog-event.dto";

export class TimelogDto {
    @MinLength(1)
    public declare userId: string;

    @Min(1)
    public declare phaseId: number;

    @Min(1)
    public declare questionId: number;

    @Min(0)
    public declare startTimestamp: number;

    @Min(0)
    public declare endTimestamp: number;

    @IsBoolean()
    public declare correct: boolean;

    @IsBoolean()
    public declare skipped: boolean;

    @Min(0)
    public declare totalOptionChanges: number;

    @Min(0)
    public declare totalOptionHovers: number;

    @ValidateNested()
    @TransformToInstance(TimelogEventDto, {}, { each: true })
    @IsArray()
    public declare events: TimelogEventDto[];
}
