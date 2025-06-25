import { ApiResponses } from "@decorators";
import { Body, Controller, Post } from "@nestjs/common";
import { PostTestDto, PreTestDto } from "./dtos";
import { FormsService } from "./forms.service";

@Controller("forms")
export class FormsController {
    public constructor(private readonly formsService: FormsService) {
    }

    @Post("pre-test")
    @ApiResponses({
        created: "Successfully saved pre-test form.",
        badRequest: "Validation errors (body).",
    })
    public savePreTest(@Body() dto: PreTestDto): void {
        this.formsService.savePreTest(dto);
    }

    @Post("post-test")
    @ApiResponses({
        created: "Successfully saved post-test form.",
        badRequest: "Validation errors (body).",
    })
    public savePostTest(@Body() dto: PostTestDto): void {
        this.formsService.savePostTest(dto);
    }
}
