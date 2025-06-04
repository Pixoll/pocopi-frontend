import { Body, Controller, Get, Post } from "@nestjs/common";
import { TimelogDto } from "./dtos/timelog.dto";
import { Timelog } from "./entities/timelog.entity";
import { TimelogService } from "./timelog.service";

@Controller("timelog")
export class TimelogController {
    public constructor(private readonly timelogService: TimelogService) {
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
