import Decimal from "decimal.js";
import { shuffle } from "./shuffle";
import { FlatRawConfig, FlatRawGroup, FlatRawPhase, FlatRawProtocol, RawOption, RawQuestion } from "./types";

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
    private readonly groups: readonly Group[];
    private readonly probabilitySums: readonly Decimal[];

    public constructor(config: FlatRawConfig) {
        this.groups = Object.freeze(this.parseGroups(config));

        const probabilitySums: Decimal[] = [];
        let lastProbability = new Decimal(0);

        for (const { probability } of this.groups) {
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

        return this.groups[index]!;
    }

    private parseGroups(config: FlatRawConfig): Group[] {
        const groups = Object.entries(config.groups)
            .map(([label, group]) => new Group(label, group));

        return groups.sort((a, b) => a.probability.comparedTo(b.probability));
    }
}

export class Group {
    public readonly label: string;
    public readonly probability: Decimal;
    public readonly protocol: Protocol;

    public constructor(label: string, group: FlatRawGroup) {
        this.label = label;
        this.probability = new Decimal(group.probability);
        this.protocol = new Protocol(group.protocol);
        Object.freeze(this);
    }
}

export class Protocol {
    public readonly allowPreviousPhase: boolean;
    public readonly allowSkipPhase: boolean;

    private readonly randomize: boolean;
    private readonly phases: readonly Phase[];

    public constructor(protocol: FlatRawProtocol) {
        this.phases = Object.freeze(protocol.phases.map(p => new Phase(p)));
        this.randomize = protocol.randomize ?? defaults.protocol.randomize;
        this.allowPreviousPhase = protocol.allowPreviousPhase ?? defaults.protocol.allowPreviousPhase;
        this.allowSkipPhase = protocol.allowSkipPhase ?? defaults.protocol.allowSkipPhase;
        Object.freeze(this);
    }

    public getPhases(): readonly Phase[] {
        return this.randomize
            ? Object.freeze(shuffle(this.phases.map(o => o)))
            : this.phases;
    }
}

export class Phase {
    public readonly allowPreviousQuestion: boolean;
    public readonly allowSkipQuestion: boolean;

    private readonly randomize: boolean;
    private readonly questions: readonly Question[];

    public constructor(phase: FlatRawPhase) {
        this.questions = Object.freeze(phase.questions.map(q => new Question(q)));
        this.randomize = phase.randomize ?? defaults.phase.randomize;
        this.allowPreviousQuestion = phase.allowPreviousQuestion ?? defaults.phase.allowPreviousQuestion;
        this.allowSkipQuestion = phase.allowSkipQuestion ?? defaults.phase.allowSkipQuestion;
        Object.freeze(this);
    }

    public getQuestions(): readonly Question[] {
        return this.randomize
            ? Object.freeze(shuffle(this.questions.map(o => o)))
            : this.questions;
    }
}

export class Question {
    public readonly image: Image;

    private readonly randomize: boolean;
    private readonly options: readonly Option[];

    public constructor(question: RawQuestion) {
        this.image = Object.freeze(question.img);
        this.options = Object.freeze(question.options.map(o => Object.freeze<Option>({
            ...defaults.option,
            ...o,
        })));
        this.randomize = question.randomize ?? defaults.question.randomize;
        Object.freeze(this);
    }

    public getOptions(): readonly Option[] {
        return this.randomize
            ? Object.freeze(shuffle(this.options.map(o => o)))
            : this.options;
    }
}

export type Option = Image & {
    readonly correct: boolean;
};

export type Image = {
    readonly src: string;
    readonly alt: string;
};
