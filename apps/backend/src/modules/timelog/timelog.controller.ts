import { Controller, Get, Post, Body } from "@nestjs/common";
import { TimelogDto } from "./dtos/timelog.dto";
import { TimelogService } from "./timelog.service";
import { Timelog } from "./entities/timelog.entity";


@Controller("timelog")
export class TimelogController {
    constructor(private readonly timelogService: TimelogService) {}

    @Post()
    public logTimelog(@Body() timelogDto: TimelogDto): { message: string } {
        // Aquí 'timelogDto' contiene el JSON enviado en la solicitud POST
        this.timelogService.logTimelog(timelogDto);
        console.log("Nuevo timelog recibido:",timelogDto);
        return { message: "Timelog registrado correctamente" };
    }

    @Get()
    public getTimelog(): Timelog[] {
        return this.timelogService.getTimelogs();
    }
}     

// Removed duplicate TimelogDto class declaration since it's already imported from './dto/timelog.dto'


