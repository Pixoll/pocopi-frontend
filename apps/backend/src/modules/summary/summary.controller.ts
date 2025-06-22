import { ApiResponses } from "@decorators";
import { Controller, Get } from "@nestjs/common";
import { Summary } from "./entities";
import { SummaryService } from "./summary.service";

@Controller("summary")
export class SummaryController {
    public constructor(private readonly summaryService: SummaryService) {
    }

    /**
     * Get user data and timelogs summary for the admin dashboard.
     */
    @Get()
    @ApiResponses({
        ok: {
            description: "Successfully obtained user data and timelogs summary.",
            type: Summary,
        },
    })
    public getSummary(): Summary {
        return this.summaryService.getSummary();
    }
}
