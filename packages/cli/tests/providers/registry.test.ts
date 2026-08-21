import { afterEach, describe, expect, it } from "vitest";
import { getProvider, listProviderIds, resolveProviderId } from "../../src/providers/registry.js";

const savedProvider = process.env.EUROCLOUD_PROVIDER;

describe("provider registry", () => {
  afterEach(() => {
    if (savedProvider === undefined) {
      delete process.env.EUROCLOUD_PROVIDER;
    } else {
      process.env.EUROCLOUD_PROVIDER = savedProvider;
    }
  });

  it("lists hetzner and ovh", () => {
    expect(listProviderIds()).toEqual(["hetzner", "ovh"]);
  });

  it("defaults to hetzner", () => {
    delete process.env.EUROCLOUD_PROVIDER;
    expect(resolveProviderId()).toBe("hetzner");
  });

  it("reads EUROCLOUD_PROVIDER", () => {
    process.env.EUROCLOUD_PROVIDER = "ovh";
    expect(resolveProviderId()).toBe("ovh");
  });

  it("accepts ovhcloud as an alias", () => {
    expect(resolveProviderId("ovhcloud")).toBe("ovhcloud");
  });

  it("throws for unknown providers", () => {
    expect(() => getProvider("aws")).toThrow(/Unknown provider: aws/);
  });
});
