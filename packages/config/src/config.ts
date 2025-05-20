import Decimal from "decimal.js";
import {
    FlatRawConfig,
    FlatRawGroupWithLabel,
    FlatRawPhase,
    FlatRawProtocol,
    FormQuestionType,
    RawForm, RawFormOption, RawFormQuestion,
    RawOption,
    RawPhaseQuestion,
} from "./raw-types";
import { shuffle } from "./shuffle";

const defaults = Object.freeze({
    protocol: Object.freeze({
        allowPreviousPhase: true,
        allowSkipPhase: true,
        randomize: false,
    } satisfies Partial<FlatRawProtocol>),
    phase: Object.freeze({
        allowPreviousQuestion: true,
        allowSkipQuestion: true,
        randomize: false,
    } satisfies Partial<FlatRawPhase>),
    question: Object.freeze({
        randomize: false,
    } satisfies Partial<RawPhaseQuestion>),
    option: Object.freeze({
        correct: false,
    } satisfies Partial<RawOption>),
});

export class Config {
    public readonly title: string;
    public readonly description: string;
    public readonly preTestForm?: Form;
    public readonly postTestForm?: Form;

    private readonly groups: readonly FlatRawGroupWithLabel[];
    private readonly probabilitySums: readonly Decimal[];

    public constructor(config: FlatRawConfig) {
        this.title = config.title;
        this.description = config.description;

        if (config.preTestForm) {
            this.preTestForm = makeForm(config.preTestForm);
        }
        if (config.postTestForm) {
            this.postTestForm = makeForm(config.postTestForm);
        }

        this.groups = Object.freeze(parseGroups(config));

        const probabilitySums: Decimal[] = [];
        let lastProbability = new Decimal(0);

        for (const { probability } of Object.values(this.groups)) {
            lastProbability = lastProbability.add(probability);
            probabilitySums.push(lastProbability);
        }

        this.probabilitySums = Object.freeze(probabilitySums);

        Object.freeze(this);
    }

    public sampleGroup(): Group {
        const randomValue = crypto.getRandomValues(new Uint32Array(1))[0]!;
        const targetProbability = new Decimal("0." + randomValue.toString().split("").reverse().join(""));

        let left = 0;
        let right = this.probabilitySums.length - 1;
        let index = 0;

        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            const value = this.probabilitySums[mid]!;

            if (value.greaterThan(targetProbability)) {
                index = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        return makeGroup(this.groups[index]!);
    }
}

function makeForm(form: RawForm): Form {
    return Object.freeze({
        questions: Object.freeze(form.questions.map(makeFormQuestion)),
    });
}

function makeFormQuestion(question: RawFormQuestion): FormQuestion {
    switch (question.type) {
        case FormQuestionType.SELECT_MULTIPLE:
            return Object.freeze({
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                options: Object.freeze(question.options.map(makeFormOption)),
                min: question.min,
                max: question.max,
            });
        case FormQuestionType.SELECT_ONE:
            return Object.freeze({
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                options: Object.freeze(question.options.map(makeFormOption)),
            });
        case FormQuestionType.NUMBER:
            return Object.freeze({
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                placeholder: question.placeholder,
                min: question.min,
                max: question.max,
                step: question.step,
            });
        case FormQuestionType.SLIDER:
            return Object.freeze({
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                min: question.min,
                max: question.max,
                step: question.step,
            });
        case FormQuestionType.TEXT_SHORT:
            return Object.freeze({
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                placeholder: question.placeholder,
                minLength: question.minLength,
                maxLength: question.maxLength,
            });
        case FormQuestionType.TEXT_LONG:
            return Object.freeze({
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                placeholder: question.placeholder,
                minLength: question.minLength,
                maxLength: question.maxLength,
            });
    }
}

function makeFormOption(option: RawFormOption): FormOption {
    return Object.freeze({
        ...option.text && { text: option.text },
        ...option.image && { image: Object.freeze(option.image) },
    });
}

function parseGroups(config: FlatRawConfig): readonly FlatRawGroupWithLabel[] {
    const groups = Object.entries(config.groups)
        .map<FlatRawGroupWithLabel>(([label, group]) => ({
            ...group,
            label,
        }));

    return groups.sort((a, b) => new Decimal(a.probability).comparedTo(b.probability));
}

function makeGroup(group: FlatRawGroupWithLabel): Group {
    return Object.freeze({
        label: group.label,
        probability: new Decimal(group.probability),
        protocol: makeProtocol(group.protocol),
    });
}

function makeProtocol(protocol: FlatRawProtocol): Protocol {
    const randomize = protocol.randomize ?? defaults.protocol.randomize;
    const phases = protocol.phases.map(makePhase);

    return Object.freeze({
        allowPreviousPhase: protocol.allowPreviousPhase ?? defaults.protocol.allowPreviousPhase,
        allowSkipPhase: protocol.allowSkipPhase ?? defaults.protocol.allowSkipPhase,
        phases: Object.freeze(randomize ? shuffle(phases) : phases),
    });
}

function makePhase(phase: FlatRawPhase): Phase {
    const randomize = phase.randomize ?? defaults.phase.randomize;
    const questions = phase.questions.map(makePhaseQuestion);

    return Object.freeze({
        allowPreviousQuestion: phase.allowPreviousQuestion ?? defaults.phase.allowPreviousQuestion,
        allowSkipQuestion: phase.allowSkipQuestion ?? defaults.phase.allowSkipQuestion,
        questions: Object.freeze(randomize ? shuffle(questions) : questions),
    });
}

function makePhaseQuestion(question: RawPhaseQuestion): Question {
    const randomize = question.randomize ?? defaults.question.randomize;
    const options = question.options.map(makeOption);

    return Object.freeze({
        ...question.text && { text: question.text },
        ...question.image && { image: Object.freeze(question.image) },
        options: Object.freeze(randomize ? shuffle(options) : options),
    });
}

function makeOption(option: RawOption): Option {
    return Object.freeze({
        ...option.text && { text: option.text },
        ...option.image && { image: Object.freeze(option.image) },
        correct: option.correct ?? defaults.option.correct,
    });
}

export type Form = {
    readonly questions: readonly FormQuestion[];
};

export type FormQuestion = {
    readonly text: string;
    readonly image?: Image;
} & (
    | FormQuestionSelectMultiple
    | FormQuestionSelectOne
    | FormQuestionNumber
    | FormQuestionSlider
    | FormQuestionTextShort
    | FormQuestionTextLong
    );

export type FormQuestionSelectMultiple = {
    readonly type: FormQuestionType.SELECT_MULTIPLE;
    readonly options: readonly FormOption[];
    readonly min: number;
    readonly max: number;
};

export type FormQuestionSelectOne = {
    readonly type: FormQuestionType.SELECT_ONE;
    readonly options: readonly FormOption[];
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
    readonly text?: string;
    readonly image?: Image;
    readonly options: readonly Option[];
};

export type Option = {
    readonly text?: string;
    readonly image?: Image;
    readonly correct: boolean;
};

export type Image = {
    readonly src: string;
    readonly alt: string;
};
