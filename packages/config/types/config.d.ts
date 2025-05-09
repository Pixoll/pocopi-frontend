import Decimal from "decimal.js";
import { FlatRawConfig } from "./raw-types";
export declare class Config {
    private readonly groups;
    private readonly probabilitySums;
    constructor(config: FlatRawConfig);
    sampleGroup(): Group;
}
export type Group = {
    readonly label: string;
    readonly probability: Decimal;
    readonly protocol: Protocol;
};
export type Protocol = {
    readonly allowPreviousPhase: boolean;
    readonly allowSkipPhase: boolean;
    readonly phases: readonly Phase[];
};
export type Phase = {
    readonly allowPreviousQuestion: boolean;
    readonly allowSkipQuestion: boolean;
    readonly questions: readonly Question[];
};
export type Question = {
    readonly image: Image;
    readonly options: readonly Option[];
};
export type Option = Image & {
    readonly correct: boolean;
};
export type Image = {
    readonly src: string;
    readonly alt: string;
};
