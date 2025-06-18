import { Body, Controller, Get, Post } from "@nestjs/common";
import { TimelogDto } from "./dtos";
import { Timelog } from "./entities";
import { TimelogsService } from "./timelogs.service";
import { ApiResponses } from "@decorators";

@Controller("timelogs")
export class TimelogsController {
    public constructor(private readonly timelogService: TimelogsService) {
    }

    /**
     * Save a timelog.
     */
    @Post()
    @ApiResponses({
        created: "Successfully saved the timelog.",
        badRequest: "Validation errors (body).",
    })
    public saveTimelog(@Body() timelogDto: TimelogDto): void {
        this.timelogService.saveTimelog(timelogDto);
    }

    /**
     * Get a list of all saved timelogs.
     */
    @Get()
    @ApiResponses({
        ok: {
            description: "Successfully retrieved the list of timelogs.",
            type: [Timelog],
        },
    })
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
