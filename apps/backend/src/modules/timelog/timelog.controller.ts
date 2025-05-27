import { Controller, Get, Post, Body } from "@nestjs/common";
import { TimelogDto } from "./dtos/timelog.dto";
import { TimelogService } from "./timelog.service";
import { Timelog } from "./entities/timelog.entity";


@Controller("timelog")
export class TimelogController {
    constructor(private readonly timelogService: TimelogService) {}

    @Post()
    public saveTimelog(@Body() timelogDto: TimelogDto):  void {
        // Aquí 'timelogDto' contiene el JSON enviado en la solicitud POST
        this.timelogService.saveTimelog(timelogDto);
        console.log("Nuevo timelog recibido:",timelogDto);
    }

    @Get()
    public getTimelogs(): Timelog[] {
        return this.timelogService.getTimelogs();
    }
}     



