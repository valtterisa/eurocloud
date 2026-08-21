import { describe, expect, it } from "vitest";
import { parseJsonOutput } from "./helpers/stdio.js";
import { run } from "./helpers/run.js";

describe("CLI without live cloud calls", () => {
  it("has no login or logout commands", async () => {
    const help = await run(["--help"]);
    expect(help.exitCode).toBe(0);
    expect(help.stdout).not.toMatch(/\blogin\b/);
    expect(help.stdout).not.toMatch(/\blogout\b/);
    expect(help.stdout).toContain("create");
    expect(help.stdout).toContain("ssh");
  });

  it("requires --name for create", async () => {
    const result = await run(["create"]);
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr + result.stdout).toMatch(/name/i);
  });

  it("rejects unknown providers", async () => {
    const result = await run(["list", "--provider", "aws", "--json"]);
    expect(result.exitCode).toBe(1);
    expect(parseJsonOutput(result.stdout)).toMatchObject({
      error: {
        code: "unknown_provider",
        message: "Unknown provider: aws. Available: hetzner, ovh",
      },
    });
  });
});
