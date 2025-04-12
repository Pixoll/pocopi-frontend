import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
    private readonly logger = new Logger(CatchEverythingFilter.name);

    public catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();

        let errorJson: ErrorJson;

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const responseMessage = exception.getResponse();

            errorJson = typeof responseMessage === "object" ? responseMessage as ErrorJson : {
                statusCode: status,
                message: responseMessage,
            };
        } else {
            let message: string;
            let stack: string | undefined;

            if (exception instanceof Error) {
                ({ message, stack } = exception);
            } else {
                message = `${exception}`;
            }

            this.logger.error(message, stack);

            errorJson = {
                message,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }

        response.status(errorJson.statusCode).json(errorJson);
    }
}

type ErrorJson = {
    statusCode: HttpStatus;
    message: string;
};
