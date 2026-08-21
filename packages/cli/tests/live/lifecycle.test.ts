import { afterAll, describe, expect, it } from "vitest";
import { isTestServerName, liveProviders, testServerName } from "../helpers/live.js";
import { run, runJson } from "../helpers/run.js";

type ServerRow = {
  id: string;
  name: string;
  provider: string;
  ipv4: string | null;
};

const providers = liveProviders();
const createdNames = new Map<string, string[]>();

async function destroyQuietly(provider: string, name: string): Promise<void> {
  const result = await run(["destroy", name, "--provider", provider, "--json"]);
  if (result.exitCode !== 0 && !result.stdout.includes("not_found") && !result.stderr.includes("not found")) {
    throw new Error(`Failed to destroy ${name} on ${provider}: ${result.stderr || result.stdout}`);
  }
}

async function sweepProvider(provider: string): Promise<void> {
  const listed = (await runJson(["list", "--provider", provider, "--json"])) as ServerRow[];
  const leftovers = listed.filter((server) => isTestServerName(server.name));
  for (const server of leftovers) {
    await destroyQuietly(provider, server.name);
  }
}

describe("live cloud lifecycle", () => {
  it("has credentials for at least one provider", () => {
    expect(
      providers,
      "No cloud credentials found. Set HCLOUD_TOKEN and/or OVH_APPLICATION_KEY, OVH_APPLICATION_SECRET, OVH_CONSUMER_KEY, OVH_PROJECT_ID in .env",
    ).not.toEqual([]);
  });

  afterAll(async () => {
    for (const provider of providers) {
      const names = createdNames.get(provider) ?? [];
      for (const name of names) {
        await destroyQuietly(provider, name);
      }
      await sweepProvider(provider);
    }
  });

  for (const provider of providers) {
    it(
      `${provider}: creates a real server, then lists, gets, and deletes it`,
      async () => {
        const name = testServerName(provider);
        createdNames.set(provider, [...(createdNames.get(provider) ?? []), name]);

        const created = (await runJson(["create", "--name", name, "--provider", provider, "--json"])) as ServerRow & {
          status: string;
          type: string;
          location: string;
        };
        expect(created.name).toBe(name);
        expect(created.provider).toBe(provider);
        expect(created.id).toBeTruthy();

        const listed = (await runJson(["list", "--provider", provider, "--json"])) as ServerRow[];
        expect(listed.some((server) => server.name === name)).toBe(true);

        const got = (await runJson(["get", name, "--provider", provider, "--json"])) as ServerRow;
        expect(got.id).toBe(created.id);
        expect(got.name).toBe(name);

        if (got.ipv4) {
          const ssh = (await runJson(["ssh", name, "--provider", provider, "--json"])) as {
            host: string;
            command: string;
          };
          expect(ssh.host).toBe(got.ipv4);
          expect(ssh.command).toContain(got.ipv4);
        }

        const destroyed = (await runJson(["destroy", name, "--provider", provider, "--json"])) as {
          destroyed: boolean;
          name: string;
        };
        expect(destroyed.destroyed).toBe(true);
        expect(destroyed.name).toBe(name);

        const remaining = (await runJson(["list", "--provider", provider, "--json"])) as ServerRow[];
        expect(remaining.some((server) => server.name === name)).toBe(false);
      },
      180_000,
    );
  }
});
