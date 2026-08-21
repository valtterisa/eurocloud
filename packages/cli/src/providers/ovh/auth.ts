import { CliError } from "../../utils/errors.js";

export const OVH_ENDPOINTS: Record<string, string> = {
  "ovh-eu": "https://eu.api.ovh.com/1.0",
  "ovh-us": "https://api.us.ovhcloud.com/1.0",
  "ovh-ca": "https://ca.api.ovh.com/1.0",
};

export type OvhCredentials = {
  applicationKey: string;
  applicationSecret: string;
  consumerKey: string;
  projectId: string;
  endpoint: string;
};

export function resolveOvhEndpoint(value = process.env.OVH_ENDPOINT): string {
  const raw = value?.trim() || "ovh-eu";
  return OVH_ENDPOINTS[raw] ?? raw.replace(/\/$/, "");
}

export function getOvhCredentials(): OvhCredentials {
  const applicationKey = process.env.OVH_APPLICATION_KEY?.trim();
  const applicationSecret = process.env.OVH_APPLICATION_SECRET?.trim();
  const consumerKey = process.env.OVH_CONSUMER_KEY?.trim();
  const projectId = process.env.OVH_PROJECT_ID?.trim() || process.env.OVH_CLOUD_PROJECT?.trim();

  if (!applicationKey || !applicationSecret || !consumerKey || !projectId) {
    throw new CliError(
      "Missing OVH credentials. Set OVH_APPLICATION_KEY, OVH_APPLICATION_SECRET, OVH_CONSUMER_KEY, and OVH_PROJECT_ID.",
      "missing_credentials",
    );
  }

  return {
    applicationKey,
    applicationSecret,
    consumerKey,
    projectId,
    endpoint: resolveOvhEndpoint(),
  };
}
