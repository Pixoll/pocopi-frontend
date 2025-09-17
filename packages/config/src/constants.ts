import { readdirSync } from "fs";
import path from "path";

export const ESM_SCRIPT_PATH = path.join(__dirname, "../esm/index.js");
export const TRANSLATIONS_TS_PATH = path.join(__dirname, "../src/translations.ts");
export const CONFIG_DIR = path.join(__dirname, "../../../config");
export const JSON_SCHEMAS_DIR = path.join(CONFIG_DIR, "schemas");
export const FORMS_CONFIG_PATH = path.join(CONFIG_DIR, "forms.yaml");
export const HOME_CONFIG_PATH = path.join(CONFIG_DIR, "home.yaml");
export const TEST_CONFIG_PATH = path.join(CONFIG_DIR, "test.yaml");
export const TRANSLATIONS_CONFIG_PATH = path.join(CONFIG_DIR, "translations.yaml");
export const FORMS_JSON_SCHEMA_PATH = path.join(JSON_SCHEMAS_DIR, "forms.json");
export const HOME_JSON_SCHEMA_PATH = path.join(JSON_SCHEMAS_DIR, "home.json");
export const TEST_JSON_SCHEMA_PATH = path.join(JSON_SCHEMAS_DIR, "test.json");
export const TRANSLATIONS_JSON_SCHEMA_PATH = path.join(JSON_SCHEMAS_DIR, "translations.json");
export const FRONTEND_PUBLIC_PATH = path.join(__dirname, "../../../apps/frontend/public/images");
export const IMAGES_DIR = path.join(CONFIG_DIR, "images");
export const IMAGE_NAMES = new Set<string>((readdirSync(IMAGES_DIR, { recursive: true }) as string[])
    .map(f => f.replace(/\\/g, "/"))
);
