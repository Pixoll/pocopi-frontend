import { IsUndefinedIf } from "@decorators";
import { config } from "@pocopi/config";
import { IsBoolean, IsEmail, IsIn, IsInt, IsString, Min, MinLength } from "class-validator";

export class UserDto {
    /**
     * Whether the user is anonymous or not.
     *
     * @example false
     */
    @IsBoolean()
    public declare anonymous: boolean;

    /**
     * The ID of the user.
     *
     * @example "12.345.678-9"
     */
    @MinLength(1)
    @IsString()
    public declare id: string;

    /**
     * The test group that was assigned to this user.
     *
     * @example "control"
     */
    @IsIn(config.groupLabels)
    @IsString()
    public declare group: string;

    /**
     * The real name of the user. Required if not an anon. user.
     *
     * @example "John"
     */
    @MinLength(1)
    @IsString()
    @IsUndefinedIf((user: UserDto) => user.anonymous, {
        message: "$property should not be provided if user is anonymous.",
    })
    public declare name?: string;

    /**
     * The email of the user. Required if not an anon. user.
     *
     * @example "john@email.com"
     */
    @IsEmail()
    @MinLength(1)
    @IsString()
    @IsUndefinedIf((user: UserDto) => user.anonymous, {
        message: "$property should not be provided if user is anonymous.",
    })
    public declare email?: string;

    /**
     * The age of the user. Required if not an anon. user.
     *
     * @example 21
     */
    @Min(0)
    @IsInt()
    @IsUndefinedIf((user: UserDto) => user.anonymous, {
        message: "$property should not be provided if user is anonymous.",
    })
    public declare age?: number;
}
