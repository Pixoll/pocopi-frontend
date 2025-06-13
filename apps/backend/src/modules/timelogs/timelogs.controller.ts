import { Body, Controller, Get, Post } from "@nestjs/common";
import { TimelogDto } from "./dtos/timelog.dto";
import { Timelog } from "./entities/timelog.entity";
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
    public getTimelogs(): Timelog[] {
        return this.timelogService.getTimelogs();
    }
}     
