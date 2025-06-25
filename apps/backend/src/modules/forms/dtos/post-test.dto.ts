import { ArrayMinSize, IsArray, IsString, MinLength } from "class-validator";

export class PostTestDto {
    @MinLength(1)
    @IsString()
    public declare userId: string;

    @MinLength(1, { each: true })
    @IsString({ each: true })
    @ArrayMinSize(1)
    @IsArray()
    public declare answers: string[];
}
