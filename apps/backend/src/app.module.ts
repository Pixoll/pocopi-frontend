import { Module } from "@nestjs/common";
import { SummaryModule, TimelogsModule, UsersModule } from "./modules";

@Module({
    imports: [
        SummaryModule,
        TimelogsModule,
        UsersModule,
    ],
})
export class AppModule {
}
