export const TEST_PREFIX = "euro-test";

export function hasHetznerCredentials(): boolean {
  return Boolean(process.env.HCLOUD_TOKEN?.trim() || process.env.EUROCLOUD_TOKEN?.trim());
}

export function hasOvhCredentials(): boolean {
  return Boolean(
    process.env.OVH_APPLICATION_KEY?.trim() &&
      process.env.OVH_APPLICATION_SECRET?.trim() &&
      process.env.OVH_CONSUMER_KEY?.trim() &&
      (process.env.OVH_PROJECT_ID?.trim() || process.env.OVH_CLOUD_PROJECT?.trim()),
  );
}

export function liveProviders(): string[] {
  const providers: string[] = [];
  if (hasHetznerCredentials()) {
    providers.push("hetzner");
  }
  if (hasOvhCredentials()) {
    providers.push("ovh");
  }
  return providers;
}

export function testServerName(provider: string): string {
  return `${TEST_PREFIX}-${provider}-${Date.now().toString(36)}`.toLowerCase();
}

export function isTestServerName(name: string): boolean {
  return name.startsWith(`${TEST_PREFIX}-`);
}
