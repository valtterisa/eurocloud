import { runCli } from "../../src/cli.js";
import { captureStdio, parseJsonOutput } from "./stdio.js";

export async function run(argv: string[]): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> {
  const stdio = captureStdio();
  try {
    const result = await runCli(argv);
    return {
      ...result,
      stdout: stdio.stdout(),
      stderr: stdio.stderr(),
    };
  } finally {
    stdio.restore();
  }
}

export async function runJson(argv: string[]): Promise<unknown> {
  const result = await run(argv);
  if (result.exitCode !== 0) {
    throw new Error(
      `eurocloud ${argv.join(" ")} failed (${result.exitCode}): ${result.stderr || result.stdout}`,
    );
  }
  return parseJsonOutput(result.stdout);
}
