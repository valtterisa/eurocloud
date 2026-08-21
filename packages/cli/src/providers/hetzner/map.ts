import type { Server } from "../types.js";

export const PROVIDER_ID = "hetzner";

export type HetznerServer = {
  id: number;
  name: string;
  status: string;
  public_net: {
    ipv4: { ip: string } | null;
    ipv6: { ip: string } | null;
  };
  server_type: { name: string };
  datacenter: { name: string; location: { name: string } };
  image: { name: string; description: string } | null;
  created: string;
};

export function mapHetznerServer(server: HetznerServer): Server {
  return {
    id: String(server.id),
    name: server.name,
    status: server.status,
    type: server.server_type.name,
    image: server.image?.name ?? null,
    location: server.datacenter.location.name,
    ipv4: server.public_net.ipv4?.ip ?? null,
    ipv6: server.public_net.ipv6?.ip ?? null,
    created: server.created,
    provider: PROVIDER_ID,
  };
}
