import type { Server } from "../types.js";

export const PROVIDER_ID = "ovh";

export type OvhIpAddress = {
  ip: string;
  type?: string;
  version?: number;
};

export type OvhNamedRef = {
  id?: string;
  name?: string;
};

export type OvhInstance = {
  id: string;
  name: string;
  status: string;
  region: string;
  created?: string;
  creationDate?: string;
  flavorId?: string;
  imageId?: string;
  flavor?: OvhNamedRef;
  image?: OvhNamedRef;
  ipAddresses?: OvhIpAddress[];
};

export function mapOvhInstance(instance: OvhInstance): Server {
  const addresses = instance.ipAddresses ?? [];
  return {
    id: instance.id,
    name: instance.name,
    status: instance.status,
    type: instance.flavor?.name ?? instance.flavorId ?? "unknown",
    image: instance.image?.name ?? instance.imageId ?? null,
    location: instance.region,
    ipv4: pickIp(addresses, 4),
    ipv6: pickIp(addresses, 6),
    created: instance.created ?? instance.creationDate ?? "",
    provider: PROVIDER_ID,
  };
}

function pickIp(addresses: OvhIpAddress[], version: number): string | null {
  const matches = addresses.filter((address) => (address.version ?? ipVersion(address.ip)) === version);
  const publicIp = matches.find((address) => address.type === "public");
  return publicIp?.ip ?? matches[0]?.ip ?? null;
}

function ipVersion(ip: string): number {
  return ip.includes(":") ? 6 : 4;
}
