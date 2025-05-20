import Decimal from "decimal.js";
import { FlatRawConfig, FormQuestionType } from "./raw-types";
export declare class Config {
    readonly title: string;
    readonly description: string;
    readonly preTestForm?: Form;
    readonly postTestForm?: Form;
    private readonly groups;
    private readonly probabilitySums;
    constructor(config: FlatRawConfig);
    sampleGroup(): Group;
}
export type Form = {
    readonly questions: readonly FormQuestion[];
};
export type FormQuestion = {
    readonly category: string;
    readonly text: string;
    readonly image?: Image;
} & (FormQuestionSelectMultiple | FormQuestionSelectOne | FormQuestionNumber | FormQuestionSlider | FormQuestionTextShort | FormQuestionTextLong);
export type FormQuestionSelectMultiple = {
    readonly type: FormQuestionType.SELECT_MULTIPLE;
    readonly options: readonly FormOption[];
    readonly min: number;
    readonly max: number;
    readonly other: boolean;
};
export type FormQuestionSelectOne = {
    readonly type: FormQuestionType.SELECT_ONE;
    readonly options: readonly FormOption[];
    readonly other: boolean;
};
export type FormQuestionNumber = {
    readonly type: FormQuestionType.NUMBER;
    readonly placeholder: string;
    readonly min: number;
    readonly max: number;
    readonly step: number;
};
export type FormQuestionSlider = {
    readonly type: FormQuestionType.SLIDER;
    readonly min: number;
    readonly max: number;
    readonly step: number;
    readonly labels: readonly SliderLabel[];
};
export type FormQuestionTextShort = {
    readonly type: FormQuestionType.TEXT_SHORT;
    readonly placeholder: string;
    readonly minLength: number;
    readonly maxLength: number;
};
export type FormQuestionTextLong = {
    readonly type: FormQuestionType.TEXT_LONG;
    readonly placeholder: string;
    readonly minLength: number;
    readonly maxLength: number;
};
export type FormOption = {
    readonly text?: string;
    readonly image?: Image;
};
export type SliderLabel = {
    readonly number: number;
    readonly label: string;
};
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
    readonly questions: readonly PhaseQuestion[];
};
export type PhaseQuestion = {
    readonly text?: string;
    readonly image?: Image;
    readonly options: readonly TestOption[];
};
export type TestOption = {
    readonly text?: string;
    readonly image?: Image;
    readonly correct: boolean;
};
export type Image = {
    readonly src: string;
    readonly alt: string;
};
