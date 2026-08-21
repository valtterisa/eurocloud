import { formatError } from "./errors.js";

export function printJson(data: unknown): void {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

export function printLines(lines: string[]): void {
  process.stdout.write(`${lines.join("\n")}\n`);
}

export function printTable(headers: string[], rows: string[][]): void {
  const widths = headers.map((header, index) => {
    const cellWidths = rows.map((row) => (row[index] ?? "").length);
    return Math.max(header.length, ...cellWidths, 0);
  });

  const formatRow = (cells: string[]): string =>
    cells
      .map((cell, index) => (cell ?? "").padEnd(widths[index] ?? 0))
      .join("  ");

  const lines = [formatRow(headers), formatRow(headers.map((header) => "-".repeat(header.length)))];
  for (const row of rows) {
    lines.push(formatRow(row));
  }
  printLines(lines);
}

export function printError(error: unknown, json: boolean): void {
  const payload = formatError(error);
  if (json) {
    printJson({ error: payload });
    return;
  }
  process.stderr.write(`Error: ${payload.message}\n`);
}
