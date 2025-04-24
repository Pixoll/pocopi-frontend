import Decimal from "decimal.js";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { Validator } from "jsonschema";
import mime from "mime";
import path from "path";
import yaml from "yaml";
import { PoCoPIConfig } from "./types";

const CONFIG_DIR = path.join(__dirname, "../../../config");
const CONFIG_YAML_PATH = path.join(CONFIG_DIR, "config.yaml");
const CONFIG_JSON_SCHEMA_PATH = path.join(CONFIG_DIR, "config-schema.json");
const IMAGES_DIR = path.join(CONFIG_DIR, "images");

export const config = getConfig();

export * from "./types";

function getConfig(): PoCoPIConfig {
    const yamlConfig = yaml.parse(readFileSync(CONFIG_YAML_PATH, "utf-8"));
    const jsonSchema = JSON.parse(readFileSync(CONFIG_JSON_SCHEMA_PATH, "utf-8"));

    new Validator().validate(yamlConfig, jsonSchema, {
        throwFirst: true,
    });

    const config = validateConfig(yamlConfig);
    exportConfigForBrowser(config);

    return config;
}

function exportConfigForBrowser(config: PoCoPIConfig): void {
    const configCopy = JSON.parse(JSON.stringify(config)) as PoCoPIConfig;

    for (const protocol of Object.values(configCopy.protocols)) {
        for (const phase of protocol.phases) {
            // @ts-expect-error: config is readonly only outside of this module
            // noinspection JSConstantReassignment
            phase.img.src = getBase64Image(phase.img.src);

            for (const option of phase.options) {
                // @ts-expect-error: config is readonly only outside of this module
                // noinspection JSConstantReassignment
                option.src = getBase64Image(option.src);
            }
        }
    }

    const esmScriptPath = path.join(__dirname, "../esm/index.js");
    const configJson = JSON.stringify(configCopy, null, 4);

    const newScript = `export const config = ${configJson};\n`;

    writeFileSync(esmScriptPath, newScript, "utf-8");
}

function validateConfig(config: PoCoPIConfig): PoCoPIConfig {
    const imageNameToPath = new Map(readdirSync(IMAGES_DIR).map(filename =>
        [filename, path.join(IMAGES_DIR, filename).replaceAll(path.win32.sep, path.posix.sep)]
    ));

    const usedProtocols = new Map<string, string>();
    let probabilitySum = new Decimal(0);

    for (const [label, { protocol, probability }] of Object.entries(config.groups)) {
        const protocolUsedAt = usedProtocols.get(protocol);

        if (protocolUsedAt) {
            throw new Error(`Protocol '${protocol}' already used at ${protocolUsedAt}.`);
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

    const iterator = {
        * [Symbol.iterator]() {
            for (const [label, protocol] of Object.entries(config.protocols)) {
                for (let i = 0; i < protocol.phases.length; i++) {
                    const phase = protocol.phases[i]!;
                    yield { label, i, phase };
                }
            }
        },
    };

    const usedImages = new Map<string, string>();

    for (const { label, i, phase } of iterator) {
        const phaseImage = phase.img.src;
        const usedPhaseImageAt = usedImages.get(phaseImage);

        if (usedPhaseImageAt) {
            throw new Error(`Image '${phaseImage}' already used at ${usedPhaseImageAt}.`);
        }

        const phaseImagePath = imageNameToPath.get(phaseImage);
        if (!phaseImagePath) {
            throw new Error(`Image '${phaseImage}' not found in images directory.`);
        }

        // @ts-expect-error: config is readonly only outside of this module
        // noinspection JSConstantReassignment
        phase.img.src = phaseImagePath;
        usedImages.set(phaseImage, `protocols.${label}.phases[${i}].img`);

        let foundCorrect = -1;

        for (let j = 0; j < phase.options.length; j++) {
            const option = phase.options[j]!;
            const optionImage = option.src;
            const usedOptionImageAt = usedImages.get(optionImage);

            if (usedOptionImageAt) {
                throw new Error(`Image '${optionImage}' already used at ${usedOptionImageAt}.`);
            }

            const optionImagePath = imageNameToPath.get(optionImage);
            if (!optionImagePath) {
                throw new Error(`Image '${optionImage}' not found in images directory.`);
            }

            // @ts-expect-error: config is readonly only outside of this module
            // noinspection JSConstantReassignment
            option.src = optionImagePath;
            usedImages.set(optionImage, `protocols.${label}.phases[${i}].options[${j}]`);

            if (!option.correct) {
                continue;
            }

            if (foundCorrect !== -1) {
                throw new Error(
                    `protocols.${label}.phases[${i}].options[${foundCorrect}] was already marked as correct.`
                );
            }

            foundCorrect = j;
        }

        if (foundCorrect === -1) {
            throw new Error(`Could not find an option marked as correct in protocols.${label}.phases[${i}].`);
        }
    }

    return config;
}

function getBase64Image(filePath: string): string {
    return `data:${mime.getType(filePath)};base64,${readFileSync(filePath, "base64")}`;
}
