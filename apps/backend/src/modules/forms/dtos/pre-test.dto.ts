import { IsArray, IsString, MinLength } from "class-validator";

export class PreTestDto {
    @MinLength(1)
    @IsString()
    public declare userId: string;

    @IsArray()
    public declare answers: Array<string | number>;
}
