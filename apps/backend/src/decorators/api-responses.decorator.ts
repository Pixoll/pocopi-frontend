import { HttpException } from "@exceptions";
import { HttpStatus } from "@nestjs/common";
import { ApiResponse, ApiResponseNoStatusOptions as SwaggerApiResponseNoStatusOptions } from "@nestjs/swagger";
import { snakeToCamelCase } from "@utils/strings";

const nameToHttpStatus = Object.fromEntries(
    (Object.entries(HttpStatus) as HttpStatusObjectEntry[])
        .filter((entry): entry is [keyof typeof HttpStatus, `${HttpStatus}`] => Number.isInteger(+entry[1]))
        .map(([k, v]) => [snakeToCamelCase(k), +v])
) as Record<HttpStatusCodeName, HttpStatus>;

/**
 * Applies {@link ApiResponse} for each HTTP status code provided in the options.
 * If the status code is an error (>= 400), it sets the type to {@link HttpException}.
 * At least one status code is required in the options.
 *
 * @param options Value of each key must be either a description string or a {@link ApiResponseNoStatusOptions}.
 */
export function ApiResponses(options: ApiResponsesOptions): MethodDecorator & ClassDecorator {
    return ((target, propertyKey, descriptor) => {
        for (const [codeName, option] of Object.entries(options) as ApiResponsesOptionsEntry[]) {
            const status = nameToHttpStatus[codeName]!;
            const apiResponseOptions: ApiResponseNoStatusOptions = typeof option === "object" ? option : {
                description: option,
            };

            const { overrideExisting = true } = apiResponseOptions;

            if (status >= 400) {
                Object.assign(apiResponseOptions, {
                    type: HttpException,
                });
            }

            ApiResponse({
                status,
                ...apiResponseOptions,
            }, { overrideExisting })(target, propertyKey, descriptor);
        }
    }) as MethodDecorator & ClassDecorator;
}

type ApiResponsesOptions = RequireAtLeastOne<
    Record<HttpStatusCodeName, string | Require<ApiResponseNoStatusOptions, "description">>
>;

type ApiResponsesOptionsEntry = [keyof ApiResponsesOptions, ApiResponsesOptions[keyof ApiResponsesOptions]];

type ApiResponseNoStatusOptions = SwaggerApiResponseNoStatusOptions & {
    overrideExisting?: boolean;
};

type HttpStatusCodeName = CamelCase<Lowercase<keyof typeof HttpStatus>>;

type HttpStatusObjectEntry = [`${HttpStatus}` | keyof typeof HttpStatus, `${HttpStatus}` | keyof typeof HttpStatus];
