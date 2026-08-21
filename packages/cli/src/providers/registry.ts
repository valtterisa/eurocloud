import { CliError } from "../utils/errors.js";
import { createHetznerProvider } from "./hetzner/index.js";
import { createOvhProvider } from "./ovh/index.js";
import type { CloudProvider, ResolveProvider } from "./types.js";

export const DEFAULT_PROVIDER = "hetzner";

const factories: Record<string, () => CloudProvider> = {
  hetzner: () => createHetznerProvider(),
  ovh: () => createOvhProvider(),
  ovhcloud: () => createOvhProvider(),
};

export function listProviderIds(): string[] {
  return ["hetzner", "ovh"];
}

export function resolveProviderId(name?: string): string {
  const id = (name ?? process.env.EUROCLOUD_PROVIDER ?? DEFAULT_PROVIDER).trim().toLowerCase();
  return id.length > 0 ? id : DEFAULT_PROVIDER;
}

export function getProvider(name?: string): CloudProvider {
  const id = resolveProviderId(name);
  const factory = factories[id];
  if (!factory) {
    throw new CliError(
      `Unknown provider: ${id}. Available: ${listProviderIds().join(", ")}`,
      "unknown_provider",
    );
  }
  return factory();
}

export const defaultResolveProvider: ResolveProvider = getProvider;
