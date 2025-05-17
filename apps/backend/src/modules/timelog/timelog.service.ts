import { Injectable } from "@nestjs/common";
import { Timelog } from "./entities/timelog.entity";
import { existsSync, readFileSync, readdirSync, writeFileSync} from "fs"; //ocupar (sync lista de nombres de arcihvos)
//documentacion json

@Injectable()
export class TimelogService {
    private readonly timelogs: Timelog[];

    public constructor() {//leer todos los timelogs de un archivo
        this.timelogs = [];

    }

    public logTimelog(timelog: Timelog): void { //crear archivo con ese timelog (1:1)
        this.timelogs.push(timelog);
    }

    public getTimelogs(): Timelog[] {
        return this.timelogs;
    }

   /* private readTimelogs(): Timelog[] { //leer todos y cargarlos en memoria
      
    }

    private saveTimelogstofile(): void { //lo estoy guardando en un archivo
    }*/

}

//enviarlo a un archivo
