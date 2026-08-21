import { vi } from "vitest";

export function captureStdio() {
  const stdout: string[] = [];
  const stderr: string[] = [];

  const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
    stdout.push(String(chunk));
    return true;
  });
  const stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
    stderr.push(String(chunk));
    return true;
  });

  return {
    stdout: () => stdout.join(""),
    stderr: () => stderr.join(""),
    restore() {
      stdoutSpy.mockRestore();
      stderrSpy.mockRestore();
    },
  };
}

export function parseJsonOutput(text: string): unknown {
  return JSON.parse(text) as unknown;
}
