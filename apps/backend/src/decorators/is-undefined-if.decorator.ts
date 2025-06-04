import { registerDecorator, ValidateIf, ValidationArguments, ValidationOptions } from "class-validator";

/**
 * Checks if value is undefined when the condition is met and if so, ignores all validators.
 */
export function IsUndefinedIf(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    condition: (object: any) => boolean,
    validationOptions: Require<ValidationOptions, "message">
): PropertyDecorator {
    return function (object: object, propertyName: string | symbol): void {
        registerDecorator({
            name: "isUndefinedIf",
            target: object.constructor,
            propertyName: propertyName.toString(),
            options: validationOptions,
            constraints: [condition],
            validator: {
                validate(value: unknown, args: ValidationArguments) {
                    const condition = args.constraints[0] as (object: unknown) => boolean;

                    if (condition(args.object)) {
                        return value === undefined;
                    }

                    return true;
                },
            },
        });

        ValidateIf((obj) => !condition(obj) || obj[propertyName] !== undefined, validationOptions)(object, propertyName);
    };
}
