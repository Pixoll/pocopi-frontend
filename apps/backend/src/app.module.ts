import { Module } from "@nestjs/common";
import { DashboardModule, FormsModule, PingModule, TimelogsModule, UsersModule } from "./modules";

@Module({
    imports: [
        DashboardModule,
        FormsModule,
        PingModule,
        TimelogsModule,
        UsersModule,
    ],
})
export class AppModule {
}
