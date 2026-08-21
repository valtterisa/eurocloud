export type ProviderId = string;

export type Server = {
  id: string;
  name: string;
  status: string;
  type: string;
  image: string | null;
  location: string;
  ipv4: string | null;
  ipv6: string | null;
  created: string;
  provider: ProviderId;
};

export type ProviderDefaults = {
  type: string;
  image: string;
  location: string;
  sshUser: string;
};

export type CreateServerInput = {
  name: string;
  type: string;
  image: string;
  location: string;
  sshKeys: string[];
};

export type CreateServerResult = Server & {
  rootPassword: string | null;
};

export interface CloudProvider {
  readonly id: ProviderId;
  readonly defaults: ProviderDefaults;
  listServers(): Promise<Server[]>;
  getServer(nameOrId: string): Promise<Server>;
  createServer(input: CreateServerInput): Promise<CreateServerResult>;
  destroyServer(nameOrId: string): Promise<Server>;
}

export type ResolveProvider = (name: string) => CloudProvider;
