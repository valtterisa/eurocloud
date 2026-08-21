import type { CloudProvider, CreateServerInput, CreateServerResult, ProviderDefaults, Server } from "../types.js";
import { getHetznerToken } from "./auth.js";
import { HetznerClient } from "./client.js";
import { mapHetznerServer, PROVIDER_ID } from "./map.js";

export const HETZNER_DEFAULTS: ProviderDefaults = {
  type: "cpx11",
  image: "ubuntu-24.04",
  location: "nbg1",
  sshUser: "root",
};

export class HetznerProvider implements CloudProvider {
  readonly id = PROVIDER_ID;
  readonly defaults = HETZNER_DEFAULTS;

  constructor(private readonly client: HetznerClient) {}

  async listServers(): Promise<Server[]> {
    const servers = await this.client.listServers();
    return servers.map(mapHetznerServer);
  }

  async getServer(nameOrId: string): Promise<Server> {
    return mapHetznerServer(await this.client.resolveServer(nameOrId));
  }

  async createServer(input: CreateServerInput): Promise<CreateServerResult> {
    const created = await this.client.createServer({
      name: input.name,
      serverType: input.type,
      image: input.image,
      location: input.location,
      sshKeys: input.sshKeys,
    });
    return {
      ...mapHetznerServer(created.server),
      rootPassword: created.root_password,
    };
  }

  async destroyServer(nameOrId: string): Promise<Server> {
    const server = await this.client.resolveServer(nameOrId);
    await this.client.deleteServer(server.id);
    return mapHetznerServer(server);
  }
}

export function createHetznerProvider(token = getHetznerToken()): CloudProvider {
  return new HetznerProvider(new HetznerClient(token));
}
