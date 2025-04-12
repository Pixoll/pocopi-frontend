import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private static id = 1;
    private readonly logger = new Logger(LoggingInterceptor.name);

    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest<Request>();
        const { body, method, path, query } = request;
        const data = JSON.stringify({
            ...Object.keys(query).length > 0 && { query },
            ...body && Object.keys(body).length > 0 && { body },
        }, null, 2);

        const id = LoggingInterceptor.id++;
        const now = Date.now();

        this.logger.log(`Received request [${id}] ${method} ${path}: \x1B[39m${data}`);

        return next.handle().pipe(tap(() => {
            const ms = (Date.now() - now).toFixed(2);
            const formattedMs = !process.env.NO_COLOR ? `\x1B[38;5;3m${ms}ms\x1B[39m` : ms;
            this.logger.log(`Responded to request [${id}]. Took ${formattedMs}`);
        }));
    }
}
