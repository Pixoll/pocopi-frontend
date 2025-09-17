import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { Config } from "./config";
import { ESM_SCRIPT_PATH, FRONTEND_PUBLIC_PATH, TRANSLATIONS_TS_PATH } from "./constants";
import { parseConfig } from "./parser";
import { FlatRawConfig } from "./raw-types";

if (existsSync(FRONTEND_PUBLIC_PATH)) {
    rmSync(FRONTEND_PUBLIC_PATH, {
        recursive: true,
        force: true,
    });
}

mkdirSync(FRONTEND_PUBLIC_PATH, {
    recursive: true,
});

const flatConfig = parseConfig();
exportConfigForBrowser(flatConfig);
createTranslationKeyType(flatConfig);

export const config = new Config(flatConfig);

export * from "./config";
export { FormQuestionType } from "./raw-types";

/**
 * Exports the configuration for browser use by replacing `ESM_SCRIPT_PATH` such that it doesn't require filesystem
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
 * Creates the `TranslationKey` at `TRANSLATIONS_TS_PATH` so we can have type safety outside the package.
 *
 * @param config The validated and flattened configuration
 */
function createTranslationKeyType(config: FlatRawConfig): void {
    const translationKeys = Object.keys(config.translations).map(k => `"${k}"`).join("\n    | ");
    const translationsTs = `
        export type TranslationKey =
            | ${translationKeys};
    `.trim().replace(/^ {8}/gm, "") + "\n";

    writeFileSync(TRANSLATIONS_TS_PATH, translationsTs, "utf-8");
}
