import { Module } from "@nestjs/common";
import { TimelogsController } from "./timelogs.controller";
import { TimelogsService } from "./timelogs.service";

@Module({
    providers: [TimelogsService],
    controllers: [TimelogsController],
    exports: [TimelogsService],
})
export class TimelogsModule {
}
