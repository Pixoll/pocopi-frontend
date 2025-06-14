import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { Timelog } from "./entities";

const TIMELOGS_DIR = path.join(__dirname, "../../../data/timelogs");

@Injectable()
export class TimelogsService {
    private readonly timelogs: Map<string, Timelog[]>;

    public constructor() {
        this.timelogs = this.readTimelogs();
    }

    public saveTimelog(timelog: Timelog): void {
        const userTimelogs = this.timelogs.get(timelog.userId) ?? [];
        userTimelogs.push(timelog);
        this.timelogs.set(timelog.userId, userTimelogs);
        this.saveTimelogToFile(timelog);
    }

    public getTimelogs(): Map<string, Timelog[]> {
        return this.timelogs;
    }

    private readTimelogs(): Map<string, Timelog[]> {
        if (!existsSync(TIMELOGS_DIR)) {
            mkdirSync(TIMELOGS_DIR, { recursive: true });
            return new Map();
        }

        const fileNames = readdirSync(TIMELOGS_DIR);
        const timelogs = new Map<string, Timelog[]>;

        for (const filename of fileNames) {
            const filePath = path.join(TIMELOGS_DIR, filename);
            const content = readFileSync(filePath, "utf-8");
            try {
                const timelog: Timelog = JSON.parse(content);
                const userTimelogs = timelogs.get(timelog.userId) ?? [];
                userTimelogs.push(timelog);
                timelogs.set(timelog.userId, userTimelogs);
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
