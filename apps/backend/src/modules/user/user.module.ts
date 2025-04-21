import { Module } from "@nestjs/common";
import { UserController } from "@/modules/user/user.controller";

@Module({
  controllers: [UserController],
})
export class UserModule {}
