import { Module } from "@nestjs/common";
import { FormsModule, SummaryModule, TimelogsModule, UsersModule } from "./modules";

@Module({
    imports: [
        FormsModule,
        SummaryModule,
        TimelogsModule,
        UsersModule,
    ],
})
export class AppModule {
}
