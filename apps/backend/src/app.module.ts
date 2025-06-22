import { Module } from "@nestjs/common";
import { SummaryModule, PingModule, TimelogsModule, UsersModule } from "./modules";

@Module({
    imports: [
        SummaryModule,
        PingModule,
        TimelogsModule,
        UsersModule,
    ],
})
export class AppModule {
}
