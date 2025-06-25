import { Injectable } from "@nestjs/common";
import { PretestDto } from "./dtos/pretest.dto";
import { PostestDto } from "./dtos/postest.dto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

const FORMS_DIR = path.join(__dirname, "../../../data/forms");

@Injectable()
export class FormsService {
  public savePreTest(dto: PretestDto): void {
    this.saveFormToFile(dto, "pretest");
  }

  public savePostTest(dto: PostestDto): void {
    this.saveFormToFile(dto, "postest");
  }

  private saveFormToFile(dto: any, type: "pretest" | "postest") {
    if (!existsSync(FORMS_DIR)) {
      mkdirSync(FORMS_DIR, { recursive: true });
    }
    const filename = `${dto.userId}-${type}.json`;
    const filePath = path.join(FORMS_DIR, filename);
    writeFileSync(filePath, JSON.stringify(dto), "utf-8");
  }
}