import { BadRequestException, HttpException, ValidationError } from "@nestjs/common";

export function exceptionFactory(errors: ValidationError[]): HttpException {
    let prefix = "";

    while (errors.length > 0) {
        const error = errors[0];

        if (!error) break;

        const constraints = error.constraints;
        const errorMessage = Object.values(constraints ?? {})[0];

        if (errorMessage) {
            const errorMessageWithPrefix = errorMessage.replace(
                new RegExp(`(\\W?)${error.property}(\\W?)`),
                `$1${prefix}${error.property}$2`
            );
            return new BadRequestException(errorMessageWithPrefix);
        }

        if (!error.children) break;

        prefix += error.property + ".";
        errors = error.children;
    }

    return new BadRequestException("Error");
}
