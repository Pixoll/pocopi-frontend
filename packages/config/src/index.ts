import Decimal from "decimal.js";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { Validator } from "jsonschema";
import mime from "mime";
import path from "path";
import yaml from "yaml";
import { Config } from "./config";
import {
    FlatRawConfig,
    FormQuestionType,
    RawConfig,
    RawForm,
    RawFormQuestion,
    RawImage,
    RawPhase,
    RawPhaseQuestion,
    RawProtocol,
} from "./raw-types";

const ESM_SCRIPT_PATH = path.join(__dirname, "../esm/index.js");
const CONFIG_DIR = path.join(__dirname, "../../../config");
const CONFIG_YAML_PATH = path.join(CONFIG_DIR, "config.yaml");
const CONFIG_JSON_SCHEMA_PATH = path.join(CONFIG_DIR, "config-schema.json");
const IMAGES_DIR = path.join(CONFIG_DIR, "images");
const IMAGE_NAME_TO_BASE64 = new Map(readdirSync(IMAGES_DIR).map(filename =>
    [filename, getBase64Image(path.join(IMAGES_DIR, filename).replace(/\\/g, "/"))]
));

export const config = getConfig();

export * from "./config";
export { FormQuestionType } from "./raw-types";

function getConfig(): Config {
    const yamlConfig = yaml.parse(readFileSync(CONFIG_YAML_PATH, "utf-8"));
    const jsonSchema = JSON.parse(readFileSync(CONFIG_JSON_SCHEMA_PATH, "utf-8"));

    new Validator().validate(yamlConfig, jsonSchema, {
        throwAll: true,
    });

    const flatConfig = flattenConfig(yamlConfig);
    const config = validateConfig(flatConfig);
    exportConfigForBrowser(config);

    return new Config(config);
}

function exportConfigForBrowser(config: FlatRawConfig): void {
    const configJson = JSON.stringify(config, null, 4);

    const newScript = `
        import { Config } from "./config";

        export const config = new Config(${configJson});

        export { Config } from "./config";
        export { FormQuestionType } from "./raw-types";
    `.trim().replace(/^ {8}/gm, "") + "\n";

    writeFileSync(ESM_SCRIPT_PATH, newScript, "utf-8");
}

function flattenConfig(config: RawConfig): FlatRawConfig {
    const allProtocols: RawProtocol[] = [];
    const allPhases: RawPhase[] = [];
    const usedProtocols = new Set<string>();
    const usedPhases = new Set<string>();
    const usedQuestions = new Set<string>();

    for (const group of Object.values(config.groups)) {
        if (typeof group.protocol === "object") {
            allProtocols.push(group.protocol);
            continue;
        }

        if (usedProtocols.has(group.protocol)) {
            console.warn(`Protocol '${group.protocol}' already used.`);
        }

        usedProtocols.add(group.protocol);

        const protocolObject = config.protocols?.[group.protocol];
        if (!protocolObject) {
            throw new Error(`Protocol '${group.protocol}' does not exist in protocols list.`);
        }

        group.protocol = JSON.parse(JSON.stringify(protocolObject)) as RawProtocol;
        allProtocols.push(group.protocol);
    }

    for (const { phases } of allProtocols) {
        for (let i = 0; i < phases.length; i++) {
            const phase = phases[i]!;
            if (typeof phase === "object") {
                allPhases.push(phase);
                continue;
            }

            if (usedPhases.has(phase)) {
                console.warn(`Phase '${phase}' already used.`);
            }

            usedPhases.add(phase);

            const phaseObject = config.phases?.[phase];
            if (!phaseObject) {
                throw new Error(`Phase '${phase}' does not exist in phases list.`);
            }

            phases[i] = JSON.parse(JSON.stringify(phaseObject)) as RawPhase;
            allPhases.push(phases[i] as RawPhase);
        }
    }

    for (const { questions } of allPhases) {
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i]!;
            if (typeof question === "object") {
                continue;
            }

            if (usedQuestions.has(question)) {
                console.warn(`Question '${question}' already used.`);
            }

            usedQuestions.add(question);

            const questionObject = config.questions?.[question];
            if (!questionObject) {
                throw new Error(`Question '${question}' does not exist in questions list.`);
            }

            questions[i] = JSON.parse(JSON.stringify(questionObject)) as RawPhaseQuestion;
        }
    }

    delete config.protocols;
    delete config.phases;
    delete config.questions;

    return config as unknown as FlatRawConfig;
}

function validateConfig(config: FlatRawConfig): FlatRawConfig {
    const probabilitySum = Object.values(config.groups).reduce((a, b) => a.add(b.probability), new Decimal(0));
    if (probabilitySum.lessThan(1)) {
        throw new Error(`The sum of all the group probabilities should be 1. Got ${probabilitySum.toString()}`);
    }

    const usedImages = new Map<string, string>();

    if (config.preTestForm) {
        valideForm(config.preTestForm, "preTestForm", usedImages);
    }
    if (config.postTestForm) {
        valideForm(config.postTestForm, "postTestForm", usedImages);
    }

    for (const { yamlPath, question } of createPhaseQuestionsIterator(config)) {
        validateImage(question.image, `${yamlPath}.image`, usedImages);

        let correctOptionIndex = -1;

        for (let k = 0; k < question.options.length; k++) {
            const option = question.options[k]!;

            validateImage(option, `${yamlPath}.options[${k}]`, usedImages);

            if (!option.correct) {
                continue;
            }

            if (correctOptionIndex !== -1) {
                console.warn(`${yamlPath}.options[${correctOptionIndex}] was already marked as correct.`);
            }

            correctOptionIndex = k;
        }

        if (correctOptionIndex === -1) {
            console.warn(`Could not find an option marked as correct in ${yamlPath}.`);
        }
    }

    return config;
}

function valideForm(form: RawForm, key: string, usedImages: Map<string, string>): void {
    const questions = form.questions ?? [];

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i]!;
        const yamlPath = `${key}.questions[${i}]`;

        if (question.image) {
            validateImage(question.image, `${yamlPath}.image`, usedImages);
        }

        validateFormQuestion(question, yamlPath, usedImages);
    }
}

function validateFormQuestion(question: RawFormQuestion, yamlPath: string, usedImages: Map<string, string>): void {
    switch (question.type) {
        case FormQuestionType.SELECT_ONE:
        case FormQuestionType.SELECT_MULTIPLE: {
            for (let j = 0; j < question.options.length; j++) {
                const option = question.options[j]!;
                if (option.image) {
                    validateImage(option.image, `${yamlPath}.options[${j}].image`, usedImages);
                }
            }
            break;
        }
        case FormQuestionType.NUMBER:
        case FormQuestionType.SLIDER: {
            if (question.min >= question.max) {
                throw new Error(`'min' should be less than 'max' in ${yamlPath}`);
            }
            break;
        }
        case FormQuestionType.TEXT_SHORT:
        case FormQuestionType.TEXT_LONG: {
            if (question.minLength >= question.maxLength) {
                throw new Error(`'minLength' should be less than 'maxLength' in ${yamlPath}`);
            }
            break;
        }
        default:
            // @ts-expect-error: safe, will not compile if a new type is added
            throw new Error(`Unknown question type ${question.type}`);
    }
}

function validateImage(image: RawImage, yamlPath: string, usedImages: Map<string, string>): void {
    const { src } = image;
    const usedImageAt = usedImages.get(src);

    if (usedImageAt) {
        console.warn(`Image '${src}' already used at ${usedImageAt}.`);
    }

    const imagePath = IMAGE_NAME_TO_BASE64.get(src);
    if (!imagePath) {
        throw new Error(`Image '${src}' not found in images directory.`);
    }

    image.src = imagePath;
    usedImages.set(src, yamlPath);
}

function* createPhaseQuestionsIterator(config: FlatRawConfig): QuestionsIterator {
    for (const [label, { protocol }] of Object.entries(config.groups)) {
        for (let i = 0; i < protocol.phases.length; i++) {
            const phase = protocol.phases[i]!;

            for (let j = 0; j < phase.questions.length; j++) {
                const question = phase.questions[j]!;
                const yamlPath = `protocols.${label}.phases[${i}].questions[${j}]`;

                yield { yamlPath, question };
            }
        }
    }
}

function getBase64Image(filePath: string): string {
    return `data:${mime.getType(filePath)};base64,${readFileSync(filePath, "base64")}`;
}

type QuestionsIterator = Generator<{
    yamlPath: string;
    question: RawPhaseQuestion;
}, void, unknown>;
