import Decimal from "decimal.js";
import { FlatRawConfig, FlatRawGroup, FlatRawPhase, FlatRawProtocol, RawQuestion } from "./types";
export declare class Config {
    private readonly groups;
    private readonly probabilitySums;
    constructor(config: FlatRawConfig);
    sampleGroup(): Group;
    private parseGroups;
}
export declare class Group {
    readonly label: string;
    readonly probability: Decimal;
    readonly protocol: Protocol;
    constructor(label: string, group: FlatRawGroup);
}
export declare class Protocol {
    readonly allowPreviousPhase: boolean;
    readonly allowSkipPhase: boolean;
    private readonly randomize;
    private readonly phases;
    constructor(protocol: FlatRawProtocol);
    getPhases(): readonly Phase[];
}
export declare class Phase {
    readonly allowPreviousQuestion: boolean;
    readonly allowSkipQuestion: boolean;
    private readonly randomize;
    private readonly questions;
    constructor(phase: FlatRawPhase);
    getQuestions(): readonly Question[];
}
export declare class Question {
    readonly image: Image;
    private readonly randomize;
    private readonly options;
    constructor(question: RawQuestion);
    getOptions(): readonly Option[];
}
export type Option = Image & {
    readonly correct: boolean;
};
export type Image = {
    readonly src: string;
    readonly alt: string;
};
