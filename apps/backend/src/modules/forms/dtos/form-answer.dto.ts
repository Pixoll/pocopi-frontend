import { ArrayMinSize, IsArray, IsInt, IsString, Min, MinLength } from "class-validator";

export class FormAnswerDto {
    @Min(1)
    @IsInt()
    public declare questionId: number;

    @MinLength(1, { each: true })
    @IsString({ each: true })
    @ArrayMinSize(1)
    @IsArray()
    public declare answers: string[];
}
