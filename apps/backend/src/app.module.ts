import { Module } from "@nestjs/common";
import { PingModule } from "./modules";
import { UserModule } from "@/modules/user/user.module";

@Module({
  imports: [PingModule, UserModule],
})
export class AppModule {}
