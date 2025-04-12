import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class LowercaseQueryKeysPipe implements PipeTransform {
    public transform(value: unknown, metadata: ArgumentMetadata): unknown {
        if (metadata.type === "query" && typeof value === "object" && value !== null) {
            return Object.fromEntries(Object.entries(value)
                .map(([k, v]) => [k.toLowerCase(), v])
            );
        }

        return value;
    }
}
