import type {TrimmedConfig} from "@/api";

export function t(config:TrimmedConfig, key: string, ...args: string[]): string {
  let value = config.translations[key];

  if (!value) {
    console.log(new Error(`Translation key '${key}' not found.`));
    return key;
  }

  for (let i = 0; i < args.length; i++) {
    value = value.replace(`{${i}}`, args[i]!);
  }

  return value;
}
