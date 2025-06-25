import { IsArray, IsString, IsNotEmpty, MinLength} from "class-validator";

export class PostestDto {
  @IsString()
  @IsNotEmpty()
 @MinLength(1)
  public declare userId: string;

  @IsArray()
  public declare answers: (string | number)[];
}