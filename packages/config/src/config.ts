import Decimal from "decimal.js";
import {
    FlatRawConfig,
    FlatRawGroupWithLabel,
    FlatRawPhase,
    FlatRawProtocol,
    RawOption,
    RawQuestion,
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
    } satisfies Partial<RawQuestion>),
    option: Object.freeze({
        correct: false,
    } satisfies Partial<RawOption>),
});

export class Config {
    private readonly groups: readonly FlatRawGroupWithLabel[];
    private readonly probabilitySums: readonly Decimal[];

    public constructor(config: FlatRawConfig) {
        this.groups = Object.freeze(this.parseGroups(config));

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

        const n = this.probabilitySums.length;
        let left = 0, right = n - 1;
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

    private parseGroups(config: FlatRawConfig): readonly FlatRawGroupWithLabel[] {
        const groups = Object.entries(config.groups)
            .map<FlatRawGroupWithLabel>(([label, group]) => ({
                ...group,
                label,
            }));

        return groups.sort((a, b) => new Decimal(a.probability).comparedTo(b.probability));
    }
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
    const questions = phase.questions.map(makeQuestion);

    return Object.freeze({
        allowPreviousQuestion: phase.allowPreviousQuestion ?? defaults.phase.allowPreviousQuestion,
        allowSkipQuestion: phase.allowSkipQuestion ?? defaults.phase.allowSkipQuestion,
        questions: Object.freeze(randomize ? shuffle(questions) : questions),
    });
}

function makeQuestion(question: RawQuestion): Question {
    const randomize = question.randomize ?? defaults.question.randomize;
    const options = question.options.map(makeOption);

    return Object.freeze({
        image: Object.freeze(question.img),
        options: Object.freeze(randomize ? shuffle(options) : options),
    });
}

function makeOption(option: RawOption): Option {
    return Object.freeze({
        ...defaults.option,
        ...option,
    });
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
