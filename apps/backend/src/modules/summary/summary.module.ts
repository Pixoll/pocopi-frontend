import { TimelogsModule } from "@modules/timelogs";
import { UsersModule } from "@modules/users";
import { Module } from "@nestjs/common";
import { SummaryController } from "./summary.controller";
import { SummaryService } from "./summary.service";

@Module({
    imports: [TimelogsModule, UsersModule],
    providers: [SummaryService],
    controllers: [SummaryController],
})
export class SummaryModule {
}
