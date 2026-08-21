import { afterEach, describe, expect, it } from "vitest";
import { getHetznerToken } from "../src/providers/hetzner/auth.js";
import { CliError } from "../src/utils/errors.js";

const savedHcloud = process.env.HCLOUD_TOKEN;
const savedEuro = process.env.EUROCLOUD_TOKEN;

describe("getHetznerToken", () => {
  afterEach(() => {
    restore("HCLOUD_TOKEN", savedHcloud);
    restore("EUROCLOUD_TOKEN", savedEuro);
  });

  it("throws when no token is set", () => {
    delete process.env.HCLOUD_TOKEN;
    delete process.env.EUROCLOUD_TOKEN;
    expect(() => getHetznerToken()).toThrow(CliError);
    try {
      getHetznerToken();
    } catch (error) {
      expect(error).toMatchObject({ code: "missing_token", exitCode: 1 });
    }
  });

  it("treats blank tokens as missing", () => {
    process.env.HCLOUD_TOKEN = "   ";
    process.env.EUROCLOUD_TOKEN = "";
    expect(() => getHetznerToken()).toThrow(/Missing API token/);
  });

  it("reads HCLOUD_TOKEN", () => {
    process.env.HCLOUD_TOKEN = "  hcloud-secret  ";
    delete process.env.EUROCLOUD_TOKEN;
    expect(getHetznerToken()).toBe("hcloud-secret");
  });

  it("falls back to EUROCLOUD_TOKEN", () => {
    delete process.env.HCLOUD_TOKEN;
    process.env.EUROCLOUD_TOKEN = "euro-secret";
    expect(getHetznerToken()).toBe("euro-secret");
  });

  it("prefers HCLOUD_TOKEN over EUROCLOUD_TOKEN", () => {
    process.env.HCLOUD_TOKEN = "hcloud-secret";
    process.env.EUROCLOUD_TOKEN = "euro-secret";
    expect(getHetznerToken()).toBe("hcloud-secret");
  });
});

function restore(name: "HCLOUD_TOKEN" | "EUROCLOUD_TOKEN", value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}
