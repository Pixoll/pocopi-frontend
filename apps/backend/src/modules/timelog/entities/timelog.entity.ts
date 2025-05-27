import { TimelogEvent } from "./timelog-event.entity";

export class Timelog {
    public declare userId: string;

    public declare phaseId: number;

    public declare questionId: number;

    public declare startTimestamp: number;


    public declare endTimestamp: number;

    public declare correct: boolean;
    public declare skipped: boolean;


    public declare totalOptionChanges: number;


    public declare totalOptionHovers: number;

    public declare events: TimelogEvent[];
}
