import { Body, Controller, Get, Post } from "@nestjs/common";
import { TimelogDto } from "./dtos";
import { Timelog } from "./entities";
import { TimelogsService } from "./timelogs.service";

@Controller("timelogs")
export class TimelogsController {
    public constructor(private readonly timelogService: TimelogsService) {
    }

    @Post()
    public saveTimelog(@Body() timelogDto: TimelogDto): void {
        this.timelogService.saveTimelog(timelogDto);
    }

    @Get()
    public getAllTimelogs(): Timelog[] {
        const timelogs: Timelog[] = [];

        for (const userTimelogs of this.timelogService.getTimelogs().values()) {
            for (const timelog of userTimelogs) {
                timelogs.push(timelog);
            }
        }

        return timelogs;
    }
}
