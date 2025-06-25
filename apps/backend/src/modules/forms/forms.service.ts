import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { PostTestDto, PreTestDto } from "./dtos";

const FORMS_DIR = path.join(__dirname, "../../../data/forms");

@Injectable()
export class FormsService {
    public savePreTest(dto: PreTestDto): void {
        this.saveFormToFile(dto);
    }

    public savePostTest(dto: PostTestDto): void {
        this.saveFormToFile(dto);
    }

    private saveFormToFile(dto: PreTestDto | PostTestDto): void {
        if (!existsSync(FORMS_DIR)) {
            mkdirSync(FORMS_DIR, { recursive: true });
        }

        const type = dto instanceof PreTestDto ? "pre-test" : "post-test";
        const filename = `${dto.userId}-${type}.json`;
        const filePath = path.join(FORMS_DIR, filename);
        writeFileSync(filePath, JSON.stringify(dto), "utf-8");
    }
}
