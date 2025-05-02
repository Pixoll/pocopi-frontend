export type RawConfig = {
    groups: Record<string, RawGroup>;
    protocols: Record<string, RawProtocol>;
};
export type RawGroup = {
    probability: number;
    protocol: string;
};
export type RawProtocol = {
    allowPreviousPhase?: boolean;
    allowSkipPhase?: boolean;
    randomize?: boolean;
    phases: RawPhase[];
};
export type RawPhase = {
    allowPreviousQuestion?: boolean;
    allowSkipQuestion?: boolean;
    randomize?: boolean;
    questions: RawQuestion[];
};
export type RawQuestion = {
    randomize?: boolean;
    img: RawImage;
    options: RawOption[];
};
export type RawOption = RawImage & {
    correct?: boolean;
};
export type RawImage = {
    src: string;
    alt: string;
};
