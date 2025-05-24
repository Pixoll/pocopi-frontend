import { Min, MinLength  } from 'class-validator';

export class TimelogDto {
    @MinLength(1)
    public declare userId: string;

    @MinLength(1)
    public declare action: string;

    @Min(0)
    public declare timestamp: number;

    @Min(0)
    public declare duration: number; 
    
}

