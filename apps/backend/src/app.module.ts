import { Module } from "@nestjs/common";
import { PingModule, UsersModule, TimelogModule} from "./modules";


@Module({
    imports: [PingModule, UsersModule, TimelogModule],
})
export class AppModule {
}
