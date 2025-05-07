export type FlatRawConfig = {
    groups: Record<string, FlatRawGroup>;
};
export type RawConfig = {
    groups: Record<string, RawGroup>;
    protocols?: Record<string, RawProtocol>;
    phases?: Record<string, RawPhase>;
    questions?: Record<string, RawQuestion>;
};
export type FlatRawGroupWithLabel = FlatRawGroup & {
    label: string;
};
export type FlatRawGroup = Omit<RawGroup, "protocol"> & {
    protocol: FlatRawProtocol;
};
export type RawGroup = {
    probability: number;
    protocol: string | RawProtocol;
};
export type FlatRawProtocol = Omit<RawProtocol, "phases"> & {
    phases: FlatRawPhase[];
};
export type RawProtocol = {
    allowPreviousPhase?: boolean;
    allowSkipPhase?: boolean;
    randomize?: boolean;
    phases: Array<RawPhase | string>;
};
export type FlatRawPhase = Omit<RawPhase, "questions"> & {
    questions: RawQuestion[];
};
export type RawPhase = {
    allowPreviousQuestion?: boolean;
    allowSkipQuestion?: boolean;
    randomize?: boolean;
    questions: Array<RawQuestion | string>;
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
