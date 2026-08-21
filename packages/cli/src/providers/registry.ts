import { CliError } from "../utils/errors.js";
import { createHetznerProvider } from "./hetzner/index.js";
import { createOvhProvider } from "./ovh/index.js";
import type { CloudProvider, ResolveProvider } from "./types.js";

const factories: Record<string, () => CloudProvider> = {
  hetzner: () => createHetznerProvider(),
  ovh: () => createOvhProvider(),
  ovhcloud: () => createOvhProvider(),
};

export function listProviderIds(): string[] {
  return ["hetzner", "ovh"];
}

export function resolveProviderId(name: string): string {
  const id = name.trim().toLowerCase();
  if (id.length === 0) {
    throw new CliError(
      `Provider is required. Available: ${listProviderIds().join(", ")}`,
      "provider_required",
    );
  }
  return id;
}

export function getProvider(name: string): CloudProvider {
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
