import { IsEmail, Min, MinLength } from "class-validator";

export class UserDto {
    @MinLength(1)
    public declare id: string;

    @MinLength(1)
    public declare username: string;

    @IsEmail()
    @MinLength(1)
    public declare email: string;

    @Min(0)
    public declare age: number;
}
