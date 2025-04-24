export type PoCoPIConfig = {
    readonly groups: Record<string, Group>;
    readonly protocols: Record<string, Protocol>;
};

type Group = {
    readonly probability: number;
    readonly protocol: string;
};

type Protocol = {
    readonly phases: readonly ProtocolPhase[];
};

type ProtocolPhase = {
    readonly img: Image;
    readonly options: readonly Image[];
};

type Image = {
    readonly src: string;
    readonly alt: string;
    readonly correct?: boolean;
};
