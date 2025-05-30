import { BadRequestException } from "@nestjs/common";
import {
    ClassConstructor,
    ClassTransformOptions,
    plainToInstance,
    Transform,
    TransformOptions,
} from "class-transformer";

/**
 * Checks if the value is an object and if so, transforms it into an instance of the provided class.
 */
export function TransformToInstance<T extends object>(
    clazz: ClassConstructor<T>,
    classTransformOptions?: ClassTransformOptions,
    options?: TransformToInstanceOptions
): PropertyDecorator {
    return function (object: object, propertyName: string | symbol): void {
        Transform(({ value }) => {
            if (!options?.each) {
                if (typeof value !== "object" || value === null) {
                    throw new BadRequestException(`${propertyName.toString()} must be an object`);
                }

                return plainToInstance(clazz, value, classTransformOptions);
            }

            if (!Array.isArray(value) || value.some(item => typeof item !== "object" || item === null)) {
                throw new BadRequestException(`${propertyName.toString()} must be an array of objects`);
            }

            return value.map(item => plainToInstance(clazz, item, classTransformOptions));
        }, options)(object, propertyName);
    };
}

type TransformToInstanceOptions = TransformOptions & {
    each?: boolean;
};
