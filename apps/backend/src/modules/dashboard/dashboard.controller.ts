import { Summary } from "@modules/dashboard/entities";
import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
    public constructor(private readonly dashboardService: DashboardService) {
    }

    @Get()
    public getSummary(): Summary {
        return this.dashboardService.getSummary();
    }
}
