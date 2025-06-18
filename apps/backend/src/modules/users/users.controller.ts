import { ApiResponses } from "@decorators";
import { TimelogsService, Timelog } from "@modules/timelogs";
import { Body, Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { config } from "@pocopi/config";
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

    /**
     * Register a new user.
     */
    @Post()
    @ApiResponses({
        created: "Successfully registered user.",
        badRequest: "Validation errors (body).",
        conflict: "User already exists.",
    })
    public saveUser(@Body() userDto: UserDto): void {
        this.usersService.saveUser(userDto);
    }

    /**
     * Get a list of all registered users.
     */
    @Get()
    @ApiResponses({
        ok: {
            description: "Successfully retried the list of all users.",
            type: [User],
        },
    })
    public getUsers(): User[] {
        return this.usersService.getUsers();
    }

    /**
     * Get a list of timelogs associated with a user.
     */
    @Get(":id/timelogs")
    @ApiResponses({
        ok: {
            description: "Successfully retried the list of timelogs.",
            type: [Timelog],
        },
        notFound: "User does not exist.",
    })
    public getUserTimelogs(@Param("id") id: string): Timelog[] {
        const timelogs = this.timelogsService.getTimelogs().get(id);

        if (!timelogs) {
            throw new NotFoundException(config.t("backend.userDoesNotExist", id));
        }

        return timelogs;
    }
}
