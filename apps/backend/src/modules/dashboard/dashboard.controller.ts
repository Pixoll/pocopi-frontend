import { ApiResponses } from "@decorators";
import { Summary } from "@modules/dashboard/entities";
import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
    public constructor(private readonly dashboardService: DashboardService) {
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
        return this.dashboardService.getSummary();
    }
}
