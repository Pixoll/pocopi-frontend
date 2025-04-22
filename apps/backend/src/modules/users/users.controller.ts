import { Controller, Get } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    public constructor(private readonly usersService: UsersService) {
    }

    @Get()
    public getUsers(): UserEntity[] {
        return this.usersService.getUsers();
    }
}
