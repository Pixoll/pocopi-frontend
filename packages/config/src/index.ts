import Decimal from "decimal.js";
import {
    constants as fsConstants,
    copyFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "fs";
import { Validator } from "jsonschema";
import path from "path";
import yaml from "yaml";
import { Config } from "./config";
import {
    FlatRawConfig,
    FormQuestionType,
    RawForm,
    RawFormQuestion,
    RawFormsConfig,
    RawHomeConfig,
    RawImage,
    RawMergedConfig,
    RawPhase,
    RawPhaseQuestion,
    RawProtocol,
    RawTestConfig,
} from "./raw-types";

const ESM_SCRIPT_PATH = path.join(__dirname, "../esm/index.js");
const CONFIG_DIR = path.join(__dirname, "../../../config");
const JSON_SCHEMAS_DIR = path.join(CONFIG_DIR, "schemas");
const FORMS_CONFIG_PATH = path.join(CONFIG_DIR, "forms.yaml");
const HOME_CONFIG_PATH = path.join(CONFIG_DIR, "home.yaml");
const TEST_CONFIG_PATH = path.join(CONFIG_DIR, "test.yaml");
const FORMS_JSON_SCHEMA_PATH = path.join(JSON_SCHEMAS_DIR, "forms.json");
const HOME_JSON_SCHEMA_PATH = path.join(JSON_SCHEMAS_DIR, "home.json");
const TEST_JSON_SCHEMA_PATH = path.join(JSON_SCHEMAS_DIR, "test.json");
const FRONTEND_PUBLIC_PATH = path.join(__dirname, "../../../apps/frontend/public/images");
const IMAGES_DIR = path.join(CONFIG_DIR, "images");
const IMAGE_NAMES = new Set<string>((readdirSync(IMAGES_DIR, { recursive: true }) as string[])
    .map(f => f.replace(/\\/g, "/"))
);

if (existsSync(FRONTEND_PUBLIC_PATH)) {
    rmSync(FRONTEND_PUBLIC_PATH, {
        recursive: true,
        force: true,
    });
}

mkdirSync(FRONTEND_PUBLIC_PATH, {
    recursive: true,
});

export const config = getConfig();

export * from "./config";
export { FormQuestionType } from "./raw-types";

/**
 * Loads, validates, and processes the configuration from YAML file. Validates against JSON schema, flattens references,
 * and exports for browser use.
 *
 * @returns Processed configuration object
 */
function getConfig(): Config {
    const yamlFormsConfig = yaml.parse(readFileSync(FORMS_CONFIG_PATH, "utf-8"));
    const yamlHomeConfig = yaml.parse(readFileSync(HOME_CONFIG_PATH, "utf-8"));
    const yamlTestConfig = yaml.parse(readFileSync(TEST_CONFIG_PATH, "utf-8"));

    const formsJsonSchema = JSON.parse(readFileSync(FORMS_JSON_SCHEMA_PATH, "utf-8"));
    const homeJsonSchema = JSON.parse(readFileSync(HOME_JSON_SCHEMA_PATH, "utf-8"));
    const testJsonSchema = JSON.parse(readFileSync(TEST_JSON_SCHEMA_PATH, "utf-8"));

    new Validator().validate(yamlFormsConfig, formsJsonSchema, {
        throwAll: true,
    });

    new Validator().validate(yamlHomeConfig, homeJsonSchema, {
        throwAll: true,
    });

    new Validator().validate(yamlTestConfig, testJsonSchema, {
        throwAll: true,
    });

    const mergedConfigs = mergeConfigs(yamlFormsConfig, yamlHomeConfig, yamlTestConfig);
    const flatConfig = flattenConfig(mergedConfigs);
    const config = validateConfig(flatConfig);
    exportConfigForBrowser(config);

    return new Config(config);
}

/**
 * Exports the configuration for browser use by replacing ESM_SCRIPT_PATH such that it doesn't require filesystem
 * access.
 *
 * @param config - The validated and flattened configuration
 */
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

/**
 * Merges all the configuration files into one
 *
 * @param formsConfig Forms config
 * @param homeConfig Home config
 * @param testConfig Test config
 *
 * @returns Merged config object
 */
function mergeConfigs(
    formsConfig: RawFormsConfig,
    homeConfig: RawHomeConfig,
    testConfig: RawTestConfig
): RawMergedConfig {
    return {
        ...formsConfig,
        ...homeConfig,
        ...testConfig,
    };
}

/**
 * Flattens the configuration by resolving all references to protocols, phases, and questions.
 *
 * This modifies the `config` object, and it does not create a new one. The returned object has the same pointer as the
 * one passed in the arguments.
 *
 * @param config - The raw configuration with possible references
 *
 * @returns Flattened configuration with all references resolved
 */
function flattenConfig(config: RawMergedConfig): FlatRawConfig {
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

/**
 * Validates the flattened configuration. Checks group probabilities, validates forms, questions, and images.
 *
 * @param config - The flattened configuration to validate
 *
 * @returns The validated configuration
 */
function validateConfig(config: FlatRawConfig): FlatRawConfig {
    const probabilitySum = Object.values(config.groups).reduce((a, b) => a.add(b.probability), new Decimal(0));
    if (probabilitySum.lessThan(1)) {
        throw new Error(`The sum of all the group probabilities should be 1. Got ${probabilitySum.toString()}`);
    }

    const usedImages = new Map<string, string>();

    validateImage(config.icon, "icon", usedImages);

    for (let i = 0; i < (config.informationCards ?? []).length; i++) {
        const infoCard = config.informationCards![i]!;
        if (infoCard.icon) {
            validateImage(infoCard.icon, `informationCards[${i}].icon`, usedImages);
        }
    }

    if (config.preTestForm) {
        valideForm(config.preTestForm, "preTestForm", usedImages);
    }
    if (config.postTestForm) {
        valideForm(config.postTestForm, "postTestForm", usedImages);
    }

    for (const { yamlPath, question } of createPhaseQuestionsIterator(config)) {
        if (!question.text && !question.image) {
            throw new Error(`Question ${yamlPath} must have either text, image, or both.`);
        }

        if (question.image) {
            validateImage(question.image, `${yamlPath}.image`, usedImages);
        }

        let correctOptionIndex = -1;

        for (let k = 0; k < question.options.length; k++) {
            const option = question.options[k]!;

            if (!option.text && !option.image) {
                throw new Error(`Option ${yamlPath}.options[${k}] must have either text, image, or both.`);
            }

            if (option.image) {
                validateImage(option.image, `${yamlPath}.options[${k}].image`, usedImages);
            }

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

/**
 * Validates a form including all its questions and images.
 *
 * @param form - The form to validate
 * @param key - The key path for error messages
 * @param usedImages - Map of image sources to their usage paths
 */
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

/**
 * Validates a form question based on its type. Different validation rules apply to different question types.
 *
 * @param question - The question to validate
 * @param yamlPath - The path to the question for error messages
 * @param usedImages - Map of image sources to their usage paths
 */
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
        case FormQuestionType.NUMBER: {
            if (question.min >= question.max) {
                throw new Error(`min=${question.min} should be less than max=${question.max} in ${yamlPath}`);
            }
            break;
        }
        case FormQuestionType.SLIDER: {
            if (question.min >= question.max) {
                throw new Error(`min=${question.min} should be less than max=${question.max} in ${yamlPath}`);
            }

            for (const label of Object.keys(question.labels ?? {})) {
                const n = +label;
                if (n < question.min || n > question.max) {
                    throw new Error(
                        `label=${label} should be between min=${question.min} and max=${question.max} `
                        + `(inclusive) in ${yamlPath}.labels`
                    );
                }

                if (new Decimal(label).modulo(question.step).greaterThan(0)) {
                    throw new Error(`label=${label} must be divisible by step=${question.step} in ${yamlPath}`);
                }
            }

            break;
        }
        case FormQuestionType.TEXT_SHORT:
        case FormQuestionType.TEXT_LONG: {
            if (question.minLength >= question.maxLength) {
                throw new Error(
                    `minLength=${question.minLength} should be less than maxLength=${question.maxLength} `
                    + `in ${yamlPath}`
                );
            }
            break;
        }
        default:
            // @ts-expect-error: safe, will not compile if a new type is added
            throw new Error(`Unknown question type ${question.type}`);
    }
}

/**
 * Validates an image reference and converts its src to the image data in base64 URL representation. Checks if the image
 * exists and warns about duplicate usage.
 *
 * @param image - The image to validate
 * @param yamlPath - The path to the image for error messages
 * @param usedImages - Map of image sources to their usage paths
 */
function validateImage(image: RawImage, yamlPath: string, usedImages: Map<string, string>): void {
    const { src } = image;
    const usedImageAt = usedImages.get(src);

    if (usedImageAt) {
        console.warn(`Image '${src}' already used at ${usedImageAt}.`);
    }

    if (!IMAGE_NAMES.has(src)) {
        throw new Error(`Image '${src}' not found in images directory.`);
    }

    const dir = path.dirname(path.join(FRONTEND_PUBLIC_PATH, src));

    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }

    copyFileSync(path.join(IMAGES_DIR, src), path.join(FRONTEND_PUBLIC_PATH, src), fsConstants.COPYFILE_FICLONE);

    image.src = `images/${src}`;
    usedImages.set(src, yamlPath);
}

/**
 * Creates an iterator that yields all questions in all phases across all groups.
 *
 * @param config - The flattened configuration
 *
 * @yields Object containing the question and its YAML path
 */
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

type QuestionsIterator = Generator<{
    yamlPath: string;
    question: RawPhaseQuestion;
}, void, unknown>;
