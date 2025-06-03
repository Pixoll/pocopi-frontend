import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserDto } from "./dtos";
import { User } from "./entities";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    public constructor(private readonly usersService: UsersService) {
    }

    @Post()
    public saveUser(@Body() userDto: UserDto): void {
        this.usersService.saveUser(userDto);
        console.log("Nuevo timelog recibido:", userDto);
    }

    @Get()
    public getUsers(): User[] {
        return this.usersService.getUsers();
    }
}
