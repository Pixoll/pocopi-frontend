import { Body, Controller, Post } from "@nestjs/common";
import { PretestDto } from "./dtos/pretest.dto";
import { PostestDto } from "./dtos/postest.dto";
import { ApiResponses } from "@decorators";
import { FormsService } from "./forms.service";

@Controller("forms")
export class FormsController {
    public constructor(private readonly formsService: FormsService) {}

    @Post("pretest")
    @ApiResponses({
    created: "Successfully saved pretest.",
    badRequest: "Validation errors (body).",
    })
    savePreTest(@Body() dto: PretestDto) {
    @Post("postest")
    @ApiResponses({
    created: "Successfully saved postest.",
    badRequest: "Validation errors (body).",
    })
    savePostTest(@Body() dto: PostestDto) {
    return this.formsService.savePostTest(dto);
    }
    savePostTest(@Body() dto: PostestDto) {
    return this.formsService.savePostTest(dto);
    }
}