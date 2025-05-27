import { Injectable } from "@nestjs/common";
import { Timelog } from "./entities/timelog.entity";
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "fs"; //ocupar (sync lista de nombres de arcihvos)
import path from "path";

const TIMELOGS_DIR = path.join(__dirname,"../../../data/timelogs");

@Injectable()
export class TimelogService {
    private readonly timelogs: Timelog[];

    public constructor() {//leer todos los timelogs de un archivo
        this.timelogs = this.readTimelogs();
    }

    public saveTimelog(timelog: Timelog): void { //crear archivo con ese timelog (1:1)
        this.timelogs.push(timelog);
        this.saveTimelogToFile(timelog);
    }

    public getTimelogs(): Timelog[] {
        return this.timelogs;
    }

    private readTimelogs(): Timelog[] { //leer todos y cargarlos en memoria
        if (!existsSync(TIMELOGS_DIR)) {
            mkdirSync(TIMELOGS_DIR, { recursive: true });
            return [];
        }
        const fileNames = readdirSync(TIMELOGS_DIR); //lista de archivos (sin ruta)
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

    private saveTimelogToFile(timelog:Timelog): void { //lo estoy guardando en un archivo
        const filename= `${timelog.userId}-${timelog.timestamp}.json`;
        const filePath = path.join(TIMELOGS_DIR, filename);
        writeFileSync(filePath, JSON.stringify(timelog), "utf-8");
    }

}
