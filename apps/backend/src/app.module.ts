import { Module } from "@nestjs/common";
import {  PingModule } from "./modules";

@Module({
    imports: [
        PingModule,
    ],
})
export class AppModule {
}
