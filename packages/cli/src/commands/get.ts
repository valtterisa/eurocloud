import type { Command } from "commander";
import { addJsonOption, addProviderOption } from "./options.js";
import { defaultResolveProvider } from "../providers/registry.js";
import type { ResolveProvider } from "../providers/types.js";
import { printJson, printLines } from "../utils/output.js";

export function registerGet(
  program: Command,
  resolveProvider: ResolveProvider = defaultResolveProvider,
): void {
  const command = program
    .command("get")
    .description("Show server details")
    .argument("<name_or_id>", "Server name or ID");
  addProviderOption(command);
  addJsonOption(command).action(async (nameOrId: string, options: { json?: boolean; provider: string }) => {
    const provider = resolveProvider(options.provider);
    const server = await provider.getServer(nameOrId);

    if (options.json) {
      printJson(server);
      return;
    }

    printLines([
      `ID:       ${server.id}`,
      `Name:     ${server.name}`,
      `Provider: ${server.provider}`,
      `Status:   ${server.status}`,
      `Type:     ${server.type}`,
      `Image:    ${server.image ?? "-"}`,
      `Location: ${server.location}`,
      `IPv4:     ${server.ipv4 ?? "-"}`,
      `IPv6:     ${server.ipv6 ?? "-"}`,
      `Created:  ${server.created}`,
    ]);
  });
}
