import { TimelogsService, Timelog } from "@modules/timelogs";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserDto } from "./dtos";
import { User } from "./entities";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    public constructor(
        private readonly usersService: UsersService,
        private readonly timelogsService: TimelogsService
    ) {
    }

    @Post()
    public saveUser(@Body() userDto: UserDto): void {
        this.usersService.saveUser(userDto);
    }

    @Get()
    public getUsers(): User[] {
        return this.usersService.getUsers();
    }

    @Get(":id/timelogs")
    public getUserTimelogs(@Param("id") id: string): Timelog[] {
        return this.timelogsService.getTimelogs().get(id) ?? [];
    }
}
