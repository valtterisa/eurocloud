import type { Command } from "commander";
import { childProcess } from "../childProcess.js";
import { addJsonOption, addProviderOption } from "./options.js";
import { defaultResolveProvider } from "../providers/registry.js";
import type { ResolveProvider } from "../providers/types.js";
import { CliError } from "../utils/errors.js";
import { printJson } from "../utils/output.js";

export function registerSsh(
  program: Command,
  resolveProvider: ResolveProvider = defaultResolveProvider,
): void {
  const command = program
    .command("ssh")
    .description("SSH into a server")
    .argument("<name_or_id>", "Server name or ID");
  addProviderOption(command);
  command.option("--user <user>", "SSH user").option("--port <port>", "SSH port", "22");
  addJsonOption(command, "Print connection details instead of opening SSH").action(
    async (nameOrId: string, options: SshOptions) => {
      const provider = resolveProvider(options.provider);
      const server = await provider.getServer(nameOrId);
      const host = server.ipv4;
      if (!host) {
        throw new CliError(`Server ${server.name} has no public IPv4 address`, "no_ipv4");
      }

      const port = parseSshPort(options.port);
      const user = options.user ?? provider.defaults.sshUser;
      const args = buildSshArgs(user, host, port);

      if (options.json) {
        printJson({
          id: server.id,
          name: server.name,
          provider: server.provider,
          user,
          host,
          port,
          command: `ssh ${args.join(" ")}`,
        });
        return;
      }

      await runSsh(args);
    },
  );
}

type SshOptions = {
  user?: string;
  port: string;
  json?: boolean;
  provider: string;
};

export function parseSshPort(value: string): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new CliError(`Invalid SSH port: ${value}`, "invalid_port");
  }
  return port;
}

export function buildSshArgs(user: string, host: string, port: number): string[] {
  return ["-p", String(port), `${user}@${host}`];
}

export function runSsh(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = childProcess.spawn("ssh", args, { stdio: "inherit" });
    child.on("error", (error) => {
      reject(
        new CliError(
          `Failed to start ssh: ${error.message}. Make sure the ssh client is installed and on PATH.`,
          "ssh_unavailable",
        ),
      );
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new CliError(`ssh exited with code ${code ?? 1}`, "ssh_failed", code ?? 1));
    });
  });
}
