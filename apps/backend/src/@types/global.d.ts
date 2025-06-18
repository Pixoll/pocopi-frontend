declare global {
    type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;

    type CamelCase<S extends string> = S extends `${infer A}_${infer B}`
        ? `${A}${CamelCase<Capitalize<B>>}`
        : S;

    type RequireAtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
}

export {};
