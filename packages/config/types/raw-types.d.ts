export type FlatRawConfig = {
    title: string;
    description: string;
    preTestForm?: RawForm;
    postTestForm?: RawForm;
    groups: Record<string, FlatRawGroup>;
};
export type RawConfig = {
    title: string;
    description: string;
    preTestForm?: RawForm;
    postTestForm?: RawForm;
    groups: Record<string, RawGroup>;
    protocols?: Record<string, RawProtocol>;
    phases?: Record<string, RawPhase>;
    questions?: Record<string, RawPhaseQuestion>;
};
export type RawForm = {
    questions: RawFormQuestion[];
};
export declare enum FormQuestionType {
    SELECT_MULTIPLE = "select-multiple",
    SELECT_ONE = "select-one",
    NUMBER = "number",
    SLIDER = "slider",
    TEXT_SHORT = "text-short",
    TEXT_LONG = "text-long"
}
export type RawFormQuestion = {
    text: string;
    image?: RawImage;
} & (RawFormQuestionSelectMultiple | RawFormQuestionSelectOne | RawFormQuestionNumber | RawFormQuestionSlider | RawFormQuestionTextShort | RawFormQuestionTextLong);
export type RawFormQuestionSelectMultiple = {
    type: FormQuestionType.SELECT_MULTIPLE;
    options: RawFormOption[];
    min: number;
    max: number;
};
export type RawFormQuestionSelectOne = {
    type: FormQuestionType.SELECT_ONE;
    options: RawFormOption[];
};
export type RawFormQuestionNumber = {
    type: FormQuestionType.NUMBER;
    placeholder: string;
    min: number;
    max: number;
    step: number;
};
export type RawFormQuestionSlider = {
    type: FormQuestionType.SLIDER;
    min: number;
    max: number;
    step: number;
};
export type RawFormQuestionTextShort = {
    type: FormQuestionType.TEXT_SHORT;
    placeholder: string;
    minLength: number;
    maxLength: number;
};
export type RawFormQuestionTextLong = {
    type: FormQuestionType.TEXT_LONG;
    placeholder: string;
    minLength: number;
    maxLength: number;
};
export type RawFormOption = {
    text?: string;
    image?: RawImage;
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
    questions: RawPhaseQuestion[];
};
export type RawPhase = {
    allowPreviousQuestion?: boolean;
    allowSkipQuestion?: boolean;
    randomize?: boolean;
    questions: Array<RawPhaseQuestion | string>;
};
export type RawPhaseQuestion = {
    randomize?: boolean;
    image: RawImage;
    options: RawOption[];
};
export type RawOption = RawImage & {
    correct?: boolean;
};
export type RawImage = {
    src: string;
    alt: string;
};
