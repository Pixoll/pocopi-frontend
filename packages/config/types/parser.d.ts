import { FlatRawConfig } from "./raw-types";
/**
 * Loads, validates, and processes the configuration from YAML file. Validates against JSON schema, flattens references,
 * and exports for browser use.
 *
 * @returns Processed configuration object
 */
export declare function parseConfig(): FlatRawConfig;
