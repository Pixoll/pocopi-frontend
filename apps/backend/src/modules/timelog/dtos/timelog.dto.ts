import { Min, MinLength } from "class-validator";
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

    public declare correct: boolean;
    public declare skipped: boolean;

    @Min(0)
    public declare totalOptionChanges: number;

    @Min(0)
    public declare totalOptionHovers: number;

    public declare events: TimelogEventDto[];
}
