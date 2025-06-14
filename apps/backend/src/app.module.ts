import { Module } from "@nestjs/common";
import { DashboardModule, PingModule, TimelogsModule, UsersModule } from "./modules";

@Module({
    imports: [
        DashboardModule,
        PingModule,
        TimelogsModule,
        UsersModule,
    ],
})
export class AppModule {
}
