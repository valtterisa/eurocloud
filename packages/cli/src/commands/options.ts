import type { Command } from "commander";

export function addProviderOption(command: Command): Command {
  return command.requiredOption("--provider <name>", "Cloud provider");
}

export function addJsonOption(command: Command, description = "Output JSON"): Command {
  return command.option("--json", description);
}
