import type { Command } from "commander";
import { addJsonOption, addProviderOption } from "./options.js";
import { defaultResolveProvider } from "../providers/registry.js";
import type { ResolveProvider } from "../providers/types.js";
import { printJson, printLines } from "../utils/output.js";

export function registerDestroy(
  program: Command,
  resolveProvider: ResolveProvider = defaultResolveProvider,
): void {
  const command = program
    .command("destroy")
    .description("Delete a server")
    .argument("<name_or_id>", "Server name or ID");
  addProviderOption(command);
  addJsonOption(command).action(async (nameOrId: string, options: { json?: boolean; provider?: string }) => {
    const provider = resolveProvider(options.provider);
    const server = await provider.destroyServer(nameOrId);

    if (options.json) {
      printJson({
        id: server.id,
        name: server.name,
        provider: server.provider,
        destroyed: true,
      });
      return;
    }

    printLines([`Destroyed server ${server.name} (${server.id})`]);
  });
}
