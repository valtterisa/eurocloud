import type { Command } from "commander";
import { addJsonOption, addProviderOption } from "./options.js";
import { defaultResolveProvider } from "../providers/registry.js";
import type { ResolveProvider } from "../providers/types.js";
import { printJson, printLines } from "../utils/output.js";

export function registerCreate(
  program: Command,
  resolveProvider: ResolveProvider = defaultResolveProvider,
): void {
  const command = program.command("create").description("Create a server");
  addProviderOption(command);
  command
    .requiredOption("--name <name>", "Server name")
    .option("--type <server_type>", "Server type")
    .option("--image <image>", "Image")
    .option("--location <location>", "Location")
    .option("--ssh-key <name_or_id>", "SSH key name or ID (repeatable)", collectSshKeys);
  addJsonOption(command).action(async (options: CreateOptions) => {
    const provider = resolveProvider(options.provider);
    const created = await provider.createServer({
      name: options.name,
      type: options.type ?? provider.defaults.type,
      image: options.image ?? provider.defaults.image,
      location: options.location ?? provider.defaults.location,
      sshKeys: options.sshKey ?? [],
    });
    const summary = {
      id: created.id,
      name: created.name,
      status: created.status,
      type: created.type,
      image: created.image,
      location: created.location,
      ipv4: created.ipv4,
      ipv6: created.ipv6,
      created: created.created,
      provider: created.provider,
      root_password: created.rootPassword,
    };

    if (options.json) {
      printJson(summary);
      return;
    }

    const lines = [
      `Created server ${summary.name} (${summary.id})`,
      `Provider: ${summary.provider}`,
      `Status:   ${summary.status}`,
      `Type:     ${summary.type}`,
      `Image:    ${summary.image ?? "-"}`,
      `Location: ${summary.location}`,
      `IPv4:     ${summary.ipv4 ?? "-"}`,
      `IPv6:     ${summary.ipv6 ?? "-"}`,
    ];
    if (summary.root_password) {
      lines.push(`Root password: ${summary.root_password}`);
    }
    lines.push(`SSH:      eurocloud ssh ${summary.name}`);
    printLines(lines);
  });
}

type CreateOptions = {
  name: string;
  type?: string;
  image?: string;
  location?: string;
  sshKey?: string[];
  json?: boolean;
  provider?: string;
};

function collectSshKeys(value: string, previous: string[] | undefined): string[] {
  return previous ? [...previous, value] : [value];
}
