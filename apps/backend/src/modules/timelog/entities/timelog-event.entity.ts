import { TimelogEventType } from "../dtos/timelog-event.dto";

export class TimelogEvent {
    public declare type: TimelogEventType;
    public declare optionId: number;
    public declare timestamp: number;
}
