import eslint from "@eslint/js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tslint from "typescript-eslint";

export default defineConfig([
    eslint.configs.recommended,
    tslint.configs.recommended,
    {
        plugins: {
            "@typescript-eslint": tslint.plugin,
            "@stylistic/ts": stylisticTs,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
                ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
            },

            parser: tslint.parser,
            ecmaVersion: "latest",
            sourceType: "commonjs",

            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        rules: {
            "comma-dangle": ["error", {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "never",
            }],
            "eol-last": "warn",
            indent: ["warn", 4, {
                SwitchCase: 1,
            }],
            "max-len": ["warn", {
                code: 125,
            }],
            "no-var": "error",
            "operator-linebreak": ["error", "before"],
            quotes: ["warn", "double"],
            "no-multiple-empty-lines": ["warn", {
                max: 1,
                maxEOF: 0,
            }],
            eqeqeq: "error",
            "prefer-const": "error",
            camelcase: ["warn", {
                properties: "never",
            }],
            "object-property-newline": ["error", {
                allowAllPropertiesOnSameLine: true,
            }],
            "array-element-newline": ["error", "consistent"],
            "no-duplicate-imports": "error",
            "max-depth": ["error", 3],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            }],
            "@typescript-eslint/array-type": ["error", {
                default: "array-simple",
            }],
            "@typescript-eslint/consistent-type-assertions": ["error", {
                assertionStyle: "as",
            }],
            "@typescript-eslint/explicit-function-return-type": ["error", {
                allowExpressions: true,
            }],
            "@typescript-eslint/no-redundant-type-constituents": "error",
            "@typescript-eslint/prefer-reduce-type-parameter": "error",
            "@typescript-eslint/prefer-return-this-type": "error",
            "@typescript-eslint/explicit-member-accessibility": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/explicit-module-boundary-types": "error",
            "@stylistic/ts/member-delimiter-style": "error",
            "@stylistic/ts/semi": "error"
        },
    }
]);
