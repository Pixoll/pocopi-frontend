declare global {
    type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;
}

export {};
