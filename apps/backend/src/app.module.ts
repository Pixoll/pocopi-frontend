import { Module } from "@nestjs/common";
import { PingModule, UsersModule } from "./modules";

@Module({
    imports: [PingModule, UsersModule],
})
export class AppModule {
}
