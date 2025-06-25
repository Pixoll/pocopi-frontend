import { Body, Controller, Post } from "@nestjs/common";
import { PretestDto } from "./dtos/pretest.dto";
import { PostestDto } from "./dtos/postest.dto";
import { ApiResponses } from "@decorators";
import { FormsService } from "./forms.service";

@Controller("forms")
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post("pretest")
  @ApiResponses()
  savePreTest(@Body() dto: PretestDto) {
    return this.formsService.savePreTest(dto);
  }

  @Post("postest")
  @ApiResponses()
  savePostTest(@Body() dto: PostestDto) {
    return this.formsService.savePostTest(dto);
  }
}