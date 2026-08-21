import { describe, expect, it } from "vitest";
import { getProvider, listProviderIds, resolveProviderId } from "../../src/providers/registry.js";

describe("provider registry", () => {
  it("lists hetzner and ovh", () => {
    expect(listProviderIds()).toEqual(["hetzner", "ovh"]);
  });

  it("normalizes the user-supplied name", () => {
    expect(resolveProviderId("Hetzner")).toBe("hetzner");
  });

  it("rejects an empty name", () => {
    expect(() => resolveProviderId("  ")).toThrow(/Provider is required/);
  });

  it("accepts ovhcloud as an alias", () => {
    expect(resolveProviderId("ovhcloud")).toBe("ovhcloud");
  });

  it("throws for unknown providers", () => {
    expect(() => getProvider("aws")).toThrow(/Unknown provider: aws/);
  });
});
