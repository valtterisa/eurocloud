import { Command, CommanderError } from "commander";
import { registerCreate } from "./commands/create.js";
import { registerDestroy } from "./commands/destroy.js";
import { registerGet } from "./commands/get.js";
import { registerList } from "./commands/list.js";
import { registerSsh } from "./commands/ssh.js";
import { defaultResolveProvider } from "./providers/registry.js";
import type { ResolveProvider } from "./providers/types.js";
import { exitCodeOf } from "./utils/errors.js";
import { printError } from "./utils/output.js";

export function createProgram(resolveProvider: ResolveProvider = defaultResolveProvider): Command {
  const program = new Command();

  program
    .name("eurocloud")
    .description("Minimal CLI for cloud servers")
    .version("0.1.0");

  registerCreate(program, resolveProvider);
  registerList(program, resolveProvider);
  registerGet(program, resolveProvider);
  registerDestroy(program, resolveProvider);
  registerSsh(program, resolveProvider);

  program.exitOverride();
  return program;
}

export async function runCli(
  argv: string[],
  resolveProvider: ResolveProvider = defaultResolveProvider,
): Promise<{ exitCode: number }> {
  const program = createProgram(resolveProvider);
  try {
    await program.parseAsync(argv, { from: "user" });
    return { exitCode: 0 };
  } catch (error) {
    if (error instanceof CommanderError) {
      if (error.code === "commander.helpDisplayed" || error.code === "commander.version") {
        return { exitCode: 0 };
      }
      return { exitCode: error.exitCode };
    }
    printError(error, argv.includes("--json"));
    return { exitCode: exitCodeOf(error) };
  }
}
