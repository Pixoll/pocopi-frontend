export function downloadFile(blob: Blob, filename: string): void;
export function downloadFile(content: string, filename: string, type: string): void;
export function downloadFile(content: Blob | string, filename: string, type?: string): void {
  const file = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  link.click();

  URL.revokeObjectURL(url);
}
