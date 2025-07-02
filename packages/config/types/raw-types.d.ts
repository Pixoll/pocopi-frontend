export type FlatRawConfig = {
    icon: RawImage;
    title: string;
    subtitle?: string;
    description: string;
    anonymous?: boolean;
    informationCards?: RawInformationCard[];
    informedConsent: string;
    faq?: RawFaq[];
    preTestForm?: RawForm;
    postTestForm?: RawForm;
    groups: Record<string, FlatRawGroup>;
    translations: Record<string, string>;
};
export type RawMergedConfig = RawFormsConfig & RawHomeConfig & RawTestConfig & {
    translations: RawTranslationsConfig;
};
export type RawFormsConfig = {
    preTestForm?: RawForm;
    postTestForm?: RawForm;
};
export type RawHomeConfig = {
    icon: RawImage;
    title: string;
    subtitle?: string;
    description: string;
    anonymous?: boolean;
    informationCards?: RawInformationCard[];
    informedConsent: string;
    faq?: RawFaq[];
};
export type RawTestConfig = {
    groups: Record<string, RawGroup>;
    protocols?: Record<string, RawProtocol>;
    phases?: Record<string, RawPhase>;
    questions?: Record<string, RawPhaseQuestion>;
};
export type RawTranslationsConfig = Record<string, string | Record<string, string>>;
export type RawInformationCard = {
    title: string;
    description: string;
    color?: RawColor;
    icon?: RawImage;
};
export type RawFaq = {
    question: string;
    answer: string;
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
    category: string;
    text: string;
    image?: RawImage;
} & (RawFormQuestionSelectMultiple | RawFormQuestionSelectOne | RawFormQuestionNumber | RawFormQuestionSlider | RawFormQuestionTextShort | RawFormQuestionTextLong);
export type RawFormQuestionSelectMultiple = {
    type: FormQuestionType.SELECT_MULTIPLE;
    options: RawFormOption[];
    min: number;
    max: number;
    other?: boolean;
};
export type RawFormQuestionSelectOne = {
    type: FormQuestionType.SELECT_ONE;
    options: RawFormOption[];
    other?: boolean;
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
    labels?: Record<`${number}`, string>;
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
    greeting?: string;
};
export type FlatRawProtocol = Omit<RawProtocol, "phases"> & {
    phases: FlatRawPhase[];
};
export type RawProtocol = {
    allowPreviousPhase?: boolean;
    allowSkipPhase?: boolean;
    allowPreviousQuestion?: boolean;
    allowSkipQuestion?: boolean;
    randomize?: boolean;
    phases: Array<RawPhase | string>;
};
export type FlatRawPhase = Omit<RawPhase, "questions"> & {
    questions: RawPhaseQuestion[];
};
export type RawPhase = {
    randomize?: boolean;
    questions: Array<RawPhaseQuestion | string>;
};
export type RawPhaseQuestion = {
    randomize?: boolean;
    text?: string;
    image?: RawImage;
    options: RawTestOption[];
};
export type RawTestOption = {
    text?: string;
    image?: RawImage;
    correct?: boolean;
};
export type RawImage = {
    src: string;
    alt: string;
};
export type RawColor = {
    r: number;
    g: number;
    b: number;
};
