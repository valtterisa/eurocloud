import { ApiError, CliError } from "../../utils/errors.js";
import { getHetznerToken } from "./auth.js";
import type { HetznerServer } from "./map.js";

export const API_BASE = "https://api.hetzner.cloud/v1";

type Pagination = {
  page: number;
  per_page: number;
  previous_page: number | null;
  next_page: number | null;
  last_page: number | null;
  total_entries: number | null;
};

type HetznerErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

type ListServersResponse = {
  servers: HetznerServer[];
  meta: { pagination: Pagination };
};

type GetServerResponse = {
  server: HetznerServer;
};

type CreateServerResponse = {
  server: HetznerServer;
  root_password: string | null;
};

type CreateServerInput = {
  name: string;
  serverType: string;
  image: string;
  location: string;
  sshKeys: string[];
};

export class HetznerClient {
  private readonly token: string;

  constructor(token = getHetznerToken()) {
    this.token = token;
  }

  async listServers(options?: { name?: string }): Promise<HetznerServer[]> {
    const servers: HetznerServer[] = [];
    let page = 1;

    while (true) {
      const query = new URLSearchParams({
        page: String(page),
        per_page: "50",
      });
      if (options?.name) {
        query.set("name", options.name);
      }

      const body = await this.request<ListServersResponse>(`/servers?${query.toString()}`);
      servers.push(...body.servers);

      const nextPage = body.meta.pagination.next_page;
      if (!nextPage) {
        break;
      }
      page = nextPage;
    }

    return servers;
  }

  async getServer(id: number): Promise<HetznerServer> {
    const body = await this.request<GetServerResponse>(`/servers/${id}`);
    return body.server;
  }

  async resolveServer(nameOrId: string): Promise<HetznerServer> {
    if (isNumericId(nameOrId)) {
      try {
        return await this.getServer(Number(nameOrId));
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 404) {
          throw error;
        }
      }
    }

    const matches = await this.listServers({ name: nameOrId });
    const server = matches[0];
    if (!server) {
      throw new CliError(`Server not found: ${nameOrId}`, "not_found");
    }
    return server;
  }

  async createServer(input: CreateServerInput): Promise<CreateServerResponse> {
    const payload: Record<string, unknown> = {
      name: input.name,
      server_type: input.serverType,
      image: input.image,
      location: input.location,
    };
    if (input.sshKeys.length > 0) {
      payload.ssh_keys = input.sshKeys.map((key) => (isNumericId(key) ? Number(key) : key));
    }

    return await this.request<CreateServerResponse>("/servers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async deleteServer(id: number): Promise<void> {
    await this.request<void>(`/servers/${id}`, { method: "DELETE" });
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/json",
          ...(init?.body ? { "Content-Type": "application/json" } : {}),
          ...init?.headers,
        },
      });
    } catch (error) {
      throw new CliError(
        error instanceof Error ? error.message : "Network request failed",
        "network_error",
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    let data: T | HetznerErrorBody | undefined;
    if (text.length > 0) {
      try {
        data = JSON.parse(text) as T | HetznerErrorBody;
      } catch {
        throw new ApiError(
          `Hetzner API returned invalid JSON (${response.status})`,
          "invalid_response",
          response.status,
        );
      }
    }

    if (!response.ok) {
      const errorBody = data as HetznerErrorBody | undefined;
      throw new ApiError(
        errorBody?.error?.message ?? `Hetzner API request failed (${response.status})`,
        errorBody?.error?.code ?? "api_error",
        response.status,
      );
    }

    return data as T;
  }
}

function isNumericId(value: string): boolean {
  return /^[1-9][0-9]*$/.test(value);
}
