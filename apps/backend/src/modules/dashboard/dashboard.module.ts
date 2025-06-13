import { TimelogsModule } from "@modules/timelogs";
import { UsersModule } from "@modules/users";
import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
    imports: [TimelogsModule, UsersModule],
    providers: [DashboardService],
    controllers: [DashboardController],
})
export class DashboardModule {
}
