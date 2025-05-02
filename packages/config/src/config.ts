import Decimal from "decimal.js";
import { shuffle } from "./shuffle";
import { RawConfig, RawGroup, RawOption, RawPhase, RawProtocol, RawQuestion } from "./types";

const defaults = Object.freeze({
    protocol: Object.freeze({
        allowPreviousPhase: true,
        allowSkipPhase: true,
        randomize: false,
    } satisfies Partial<RawProtocol>),
    phase: Object.freeze({
        allowPreviousQuestion: true,
        allowSkipQuestion: true,
        randomize: false,
    } satisfies Partial<RawPhase>),
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

    public constructor(rawConfig: RawConfig) {
        this.groups = Object.freeze(this.parseGroups(rawConfig));

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
        const targetProbability = new Decimal(randomValue.toString().replace(/^\d(\d+)$/, "0.$1"));

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

    private parseGroups(rawConfig: RawConfig): Group[] {
        const groups: Group[] = [];

        for (const [groupLabel, rawGroup] of Object.entries(rawConfig.groups)) {
            const rawProtocol = rawConfig.protocols[rawGroup.protocol]!;
            const group = new Group(groupLabel, rawGroup, rawProtocol);
            groups.push(group);
        }

        return groups.sort((a, b) => a.probability.comparedTo(b.probability));
    }
}

export class Group {
    public readonly label: string;
    public readonly probability: Decimal;
    public readonly protocol: Protocol;

    public constructor(label: string, rawGroup: RawGroup, rawProtocol: RawProtocol) {
        this.label = label;
        this.probability = new Decimal(rawGroup.probability);
        this.protocol = new Protocol(rawGroup.protocol, rawProtocol);
        Object.freeze(this);
    }
}

export class Protocol {
    public readonly label: string;
    public readonly allowPreviousPhase: boolean;
    public readonly allowSkipPhase: boolean;

    private readonly randomize: boolean;
    private readonly phases: readonly Phase[];

    public constructor(label: string, rawProtocol: RawProtocol) {
        this.label = label;
        this.phases = Object.freeze(rawProtocol.phases.map(p => new Phase(p)));
        this.randomize = rawProtocol.randomize ?? defaults.protocol.randomize;
        this.allowPreviousPhase = rawProtocol.allowPreviousPhase ?? defaults.protocol.allowPreviousPhase;
        this.allowSkipPhase = rawProtocol.allowSkipPhase ?? defaults.protocol.allowSkipPhase;
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

    public constructor(rawPhase: RawPhase) {
        this.questions = Object.freeze(rawPhase.questions.map(q => new Question(q)));
        this.randomize = rawPhase.randomize ?? defaults.phase.randomize;
        this.allowPreviousQuestion = rawPhase.allowPreviousQuestion ?? defaults.phase.allowPreviousQuestion;
        this.allowSkipQuestion = rawPhase.allowSkipQuestion ?? defaults.phase.allowSkipQuestion;
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

    public constructor(rawQuestion: RawQuestion) {
        this.image = Object.freeze(rawQuestion.img);
        this.options = Object.freeze(rawQuestion.options.map(o => Object.freeze<Option>({
            ...defaults.option,
            ...o,
        })));
        this.randomize = rawQuestion.randomize ?? defaults.question.randomize;
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
