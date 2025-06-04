import { TransformToInstance } from "@decorators";
import { IsArray, IsBoolean, IsInt, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { TimelogEventDto } from "./timelog-event.dto";

export class TimelogDto {
    @MinLength(1)
    @IsString()
    public declare userId: string;

    @Min(1)
    @IsInt()
    public declare phaseId: number;

    @Min(1)
    @IsInt()
    public declare questionId: number;

    @Min(0)
    @IsInt()
    public declare startTimestamp: number;

    @Min(0)
    @IsInt()
    public declare endTimestamp: number;

    @IsBoolean()
    public declare correct: boolean;

    @IsBoolean()
    public declare skipped: boolean;

    @Min(0)
    @IsInt()
    public declare totalOptionChanges: number;

    @Min(0)
    @IsInt()
    public declare totalOptionHovers: number;

    @ValidateNested()
    @TransformToInstance(TimelogEventDto, {}, { each: true })
    @IsArray()
    public declare events: TimelogEventDto[];
}
