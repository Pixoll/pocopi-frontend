import Decimal from "decimal.js";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { Validator } from "jsonschema";
import mime from "mime";
import path from "path";
import yaml from "yaml";
import { Config } from "./config";
import { RawConfig, RawQuestion } from "./types";

const CONFIG_DIR = path.join(__dirname, "../../../config");
const CONFIG_YAML_PATH = path.join(CONFIG_DIR, "config.yaml");
const CONFIG_JSON_SCHEMA_PATH = path.join(CONFIG_DIR, "config-schema.json");
const IMAGES_DIR = path.join(CONFIG_DIR, "images");
const IMAGE_NAME_TO_BASE64 = new Map(readdirSync(IMAGES_DIR).map(filename =>
    [filename, getBase64Image(path.join(IMAGES_DIR, filename).replaceAll(path.win32.sep, path.posix.sep))]
));

export const config = getConfig();

export * from "./config";

function getConfig(): Config {
    const yamlConfig = yaml.parse(readFileSync(CONFIG_YAML_PATH, "utf-8"));
    const jsonSchema = JSON.parse(readFileSync(CONFIG_JSON_SCHEMA_PATH, "utf-8"));

    new Validator().validate(yamlConfig, jsonSchema, {
        throwFirst: true,
    });

    const config = validateConfig(yamlConfig);
    exportConfigForBrowser(config);

    return new Config(config);
}

function exportConfigForBrowser(config: RawConfig): void {
    const esmScriptPath = path.join(__dirname, "../esm/index.js");
    const configJson = JSON.stringify(config, null, 4);

    const newScript = `
        import { Config } from "./config";

        export const config = new Config(${configJson});
    `.trim().replace(/^ {8}/m, "") + "\n";

    writeFileSync(esmScriptPath, newScript, "utf-8");
}

function validateConfig(config: RawConfig): RawConfig {
    const usedProtocols = new Map<string, string>();
    let probabilitySum = new Decimal(0);

    for (const [label, { protocol, probability }] of Object.entries(config.groups)) {
        const protocolUsedAt = usedProtocols.get(protocol);

        if (protocolUsedAt) {
            console.warn(`Protocol '${protocol}' already used at ${protocolUsedAt}.`);
        }

        probabilitySum = probabilitySum.add(probability);

        if (!(protocol in config.protocols)) {
            throw new Error(`Protocol '${protocol}' does not exist in protocols list.`);
        }

        usedProtocols.set(protocol, `groups.${label}`);
    }

    if (!probabilitySum.equals(1)) {
        throw new Error("The sum of all the group probabilities should be 1.");
    }

    const usedImages = new Map<string, string>();

    for (const { path, question } of createQuestionsIterator(config)) {
        const questionImage = question.img.src;
        const usedQuestionImageAt = usedImages.get(questionImage);

        if (usedQuestionImageAt) {
            console.warn(`Image '${questionImage}' already used at ${usedQuestionImageAt}.`);
        }

        const questionImagePath = IMAGE_NAME_TO_BASE64.get(questionImage);
        if (!questionImagePath) {
            throw new Error(`Image '${questionImage}' not found in images directory.`);
        }

        question.img.src = questionImagePath;
        usedImages.set(questionImage, `${path}.img`);

        let foundCorrect = -1;

        for (let k = 0; k < question.options.length; k++) {
            const option = question.options[k]!;
            const optionImage = option.src;
            const usedOptionImageAt = usedImages.get(optionImage);

            if (usedOptionImageAt) {
                console.warn(`Image '${optionImage}' already used at ${usedOptionImageAt}.`);
            }

            const optionImagePath = IMAGE_NAME_TO_BASE64.get(optionImage);
            if (!optionImagePath) {
                throw new Error(`Image '${optionImage}' not found in images directory.`);
            }

            option.src = optionImagePath;
            usedImages.set(optionImage, `${path}.options[${k}]`);

            if (!option.correct) {
                continue;
            }

            if (foundCorrect !== -1) {
                console.warn(`${path}.options[${foundCorrect}] was already marked as correct.`);
            }

            foundCorrect = k;
        }

        if (foundCorrect === -1) {
            console.warn(`Could not find an option marked as correct in ${path}.`);
        }
    }

    return config;
}

function* createQuestionsIterator(config: RawConfig): QuestionsIterator {
    for (const [label, protocol] of Object.entries(config.protocols)) {
        for (let i = 0; i < protocol.phases.length; i++) {
            const phase = protocol.phases[i]!;

            for (let j = 0; j < phase.questions.length; j++) {
                const question = phase.questions[j]!;
                const path = `protocols.${label}.phases[${i}].questions[${j}]`;

                yield { path, question };
            }
        }
    }
}

function getBase64Image(filePath: string): string {
    return `data:${mime.getType(filePath)};base64,${readFileSync(filePath, "base64")}`;
}

type QuestionsIterator = Generator<{
    path: string;
    question: RawQuestion;
}, void, unknown>;
