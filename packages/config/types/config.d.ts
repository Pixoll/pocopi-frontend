import Decimal from "decimal.js";
import { RawConfig, RawGroup, RawPhase, RawProtocol, RawQuestion } from "./types";
export declare class Config {
    private readonly groups;
    private readonly probabilitySums;
    constructor(rawConfig: RawConfig);
    sampleGroup(): Group;
    private parseGroups;
}
export declare class Group {
    readonly label: string;
    readonly probability: Decimal;
    readonly protocol: Protocol;
    constructor(label: string, rawGroup: RawGroup, rawProtocol: RawProtocol);
}
export declare class Protocol {
    readonly label: string;
    readonly allowPreviousPhase: boolean;
    readonly allowSkipPhase: boolean;
    private readonly randomize;
    private readonly phases;
    constructor(label: string, rawProtocol: RawProtocol);
    getPhases(): readonly Phase[];
}
export declare class Phase {
    readonly allowPreviousQuestion: boolean;
    readonly allowSkipQuestion: boolean;
    private readonly randomize;
    private readonly questions;
    constructor(rawPhase: RawPhase);
    getQuestions(): readonly Question[];
}
export declare class Question {
    readonly image: Image;
    private readonly randomize;
    private readonly options;
    constructor(rawQuestion: RawQuestion);
    getOptions(): readonly Option[];
}
export type Option = Image & {
    readonly correct: boolean;
};
export type Image = {
    readonly src: string;
    readonly alt: string;
};
