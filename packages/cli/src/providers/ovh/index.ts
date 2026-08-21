import type { CloudProvider, CreateServerInput, CreateServerResult, ProviderDefaults, Server } from "../types.js";
import { getOvhCredentials } from "./auth.js";
import { OvhClient } from "./client.js";
import { mapOvhInstance, PROVIDER_ID } from "./map.js";

export const OVH_DEFAULTS: ProviderDefaults = {
  type: "b2-7",
  image: "Ubuntu 24.04",
  location: "GRA11",
  sshUser: "ubuntu",
};

export class OvhProvider implements CloudProvider {
  readonly id = PROVIDER_ID;
  readonly defaults = OVH_DEFAULTS;

  constructor(private readonly client: OvhClient) {}

  async listServers(): Promise<Server[]> {
    return (await this.client.listInstances()).map(mapOvhInstance);
  }

  async getServer(nameOrId: string): Promise<Server> {
    return mapOvhInstance(await this.client.resolveInstance(nameOrId));
  }

  async createServer(input: CreateServerInput): Promise<CreateServerResult> {
    const flavorId = await this.client.resolveFlavorId(input.type, input.location);
    const imageId = await this.client.resolveImageId(input.image, input.location);
    const sshKeyId = input.sshKeys[0]
      ? await this.client.resolveSshKeyId(input.sshKeys[0])
      : undefined;
    const created = await this.client.createInstance({
      name: input.name,
      flavorId,
      imageId,
      region: input.location,
      sshKeyId,
    });
    return {
      ...mapOvhInstance(created),
      rootPassword: null,
    };
  }

  async destroyServer(nameOrId: string): Promise<Server> {
    const instance = await this.client.resolveInstance(nameOrId);
    await this.client.deleteInstance(instance.id);
    return mapOvhInstance(instance);
  }
}

export function createOvhProvider(credentials = getOvhCredentials()): CloudProvider {
  return new OvhProvider(new OvhClient(credentials));
}
