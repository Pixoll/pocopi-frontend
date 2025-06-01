import { exceptionFactory } from "@exceptions";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { config } from "dotenv";
import { AppModule } from "./app.module";
import { CatchEverythingFilter } from "./filters";
import { LoggingInterceptor } from "./interceptors";
import { LowercaseQueryKeysPipe } from "./pipes";

config();

void async function () {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true,
        logger: ["debug"],
    });

    const logger = new Logger("PoCoPIApplication");

    const globalPrefix = "api";

    app.getHttpAdapter().getInstance().disable("x-powered-by");

    app.enableCors({
        origin: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    });

    app.setGlobalPrefix(globalPrefix)
        .useGlobalFilters(new CatchEverythingFilter())
        .useGlobalInterceptors(new LoggingInterceptor())
        .useGlobalPipes(
            new LowercaseQueryKeysPipe(),
            new ValidationPipe({
                exceptionFactory,
                forbidNonWhitelisted: true,
                stopAtFirstError: true,
                transform: true,
                whitelist: true,
            })
        );

    const swaggerConfig = new DocumentBuilder()
        .setTitle("PoCoPI - Proof of Concept Psycho-Informatics - API")
        .addServer(globalPrefix)
        .build();

    SwaggerModule.setup(globalPrefix, app, () => SwaggerModule.createDocument(app, swaggerConfig, {
        ignoreGlobalPrefix: true,
    }));

    await app.listen(process.env.PORT ?? 3000, "0.0.0.0");

    const appUrl = await app.getUrl()
        .then(url => url.replace("[::1]", "localhost").replace(/\/$/, "") + "/" + globalPrefix);

    logger.log(`Application is running at ${appUrl}`);
}();
