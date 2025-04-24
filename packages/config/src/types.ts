export type PoCoPIConfig = {
    readonly groups: Record<string, Group>;
    readonly protocols: Record<string, Protocol>;
};

export type Group = {
    readonly probability: number;
    readonly protocol: string;
};

export type Protocol = {
    readonly phases: readonly ProtocolPhase[];
};

export type ProtocolPhase = {
    readonly questions: readonly PhaseQuestion[];
};

export type PhaseQuestion = {
    readonly img: Image;
    readonly options: readonly Image[];
};

export type Image = {
    readonly src: string;
    readonly alt: string;
    readonly correct?: boolean;
};
