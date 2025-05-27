import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { Timelog } from "./entities/timelog.entity";

const TIMELOGS_DIR = path.join(__dirname, "../../../data/timelogs");

@Injectable()
export class TimelogService {
    private readonly timelogs: Timelog[];

    public constructor() {
        this.timelogs = this.readTimelogs();
    }

    public saveTimelog(timelog: Timelog): void {
        this.timelogs.push(timelog);
        this.saveTimelogToFile(timelog);
    }

    public getTimelogs(): Timelog[] {
        return this.timelogs;
    }

    private readTimelogs(): Timelog[] {
        if (!existsSync(TIMELOGS_DIR)) {
            mkdirSync(TIMELOGS_DIR, { recursive: true });
            return [];
        }

        const fileNames = readdirSync(TIMELOGS_DIR);
        const timelogs: Timelog[] = [];

        for (const filename of fileNames) {
            const filePath = path.join(TIMELOGS_DIR, filename);
            const content = readFileSync(filePath, "utf-8");
            try {
                const timelog: Timelog = JSON.parse(content);
                timelogs.push(timelog);
            } catch (error) {
                console.error(`Error parsing file ${filename}:`, error);
            }
        }

        return timelogs;

    }

    private saveTimelogToFile(timelog: Timelog): void {
        const filename = `${timelog.userId}-${timelog.phaseId}-${timelog.questionId}-${timelog.startTimestamp}.json`;
        const filePath = path.join(TIMELOGS_DIR, filename);
        writeFileSync(filePath, JSON.stringify(timelog), "utf-8");
    }
}
