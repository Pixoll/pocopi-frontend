export function snakeToCamelCase(text: string): string {
    return text.toLowerCase().replace(/_(\w)/g, (_, a: string) => a.toUpperCase());
}
