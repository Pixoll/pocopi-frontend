import type {SingleConfigResponse} from "@/api";

export function t(config:SingleConfigResponse, key: string, ...args: string[]): string {
  let value = config.translations[key];

  if (!value) {
    throw new Error(`Translation key '${key}' not found.`);
  }

  for (let i = 0; i < args.length; i++) {
    value = value.replace(`{${i}}`, args[i]!);
  }

  return value;
}
