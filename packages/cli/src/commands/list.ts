import type { Command } from "commander";
import { addJsonOption, addProviderOption } from "./options.js";
import { defaultResolveProvider } from "../providers/registry.js";
import type { ResolveProvider } from "../providers/types.js";
import { printJson, printLines, printTable } from "../utils/output.js";

export function registerList(
  program: Command,
  resolveProvider: ResolveProvider = defaultResolveProvider,
): void {
  const command = program.command("list").description("List all servers");
  addProviderOption(command);
  addJsonOption(command).action(async (options: { json?: boolean; provider: string }) => {
    const provider = resolveProvider(options.provider);
    const servers = await provider.listServers();

    if (options.json) {
      printJson(servers);
      return;
    }

    if (servers.length === 0) {
      printLines(["No servers found."]);
      return;
    }

    printTable(
      ["ID", "NAME", "STATUS", "TYPE", "LOCATION", "IPV4"],
      servers.map((server) => [
        server.id,
        server.name,
        server.status,
        server.type,
        server.location,
        server.ipv4 ?? "-",
      ]),
    );
  });
}
