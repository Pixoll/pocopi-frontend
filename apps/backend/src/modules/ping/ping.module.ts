import { PingController } from "./ping.controller";
import { Module } from "@nestjs/common";

@Module({
    controllers: [PingController],
})
export class PingModule {
}
