import { TransformToInstance } from "@decorators";
import { ArrayMinSize, IsArray, IsString, MinLength, ValidateNested } from "class-validator";
import { FormAnswerDto } from "./form-answer.dto";

export class FormDto {
    @MinLength(1)
    @IsString()
    public declare userId: string;

    @ValidateNested()
    @TransformToInstance(FormAnswerDto, {}, { each: true })
    @ArrayMinSize(1)
    @IsArray()
    public declare answers: FormAnswerDto[];
}
