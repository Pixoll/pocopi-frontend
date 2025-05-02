export type PoCoPIConfig = {
    readonly groups: Readonly<Record<string, Group>>;
    readonly protocols: Readonly<Record<string, Protocol>>;
};
export type Group = {
    readonly probability: number;
    readonly protocol: string;
};
export type Protocol = {
    readonly allowPreviousPhase: boolean;
    readonly allowSkipPhase: boolean;
    readonly randomize: boolean;
    readonly phases: readonly ProtocolPhase[];
};
export type ProtocolPhase = {
    readonly allowPreviousQuestion: boolean;
    readonly allowSkipQuestion: boolean;
    readonly randomize: boolean;
    readonly questions: readonly PhaseQuestion[];
};
export type PhaseQuestion = {
    readonly randomize: boolean;
    readonly img: Image;
    readonly options: readonly Image[];
};
export type Image = {
    readonly src: string;
    readonly alt: string;
    readonly correct?: boolean;
};
