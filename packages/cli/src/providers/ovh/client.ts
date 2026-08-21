import { ApiError, CliError } from "../../utils/errors.js";
import type { OvhCredentials } from "./auth.js";
import type { OvhInstance } from "./map.js";
import { signOvhRequest } from "./sign.js";

type OvhErrorBody = {
  errorCode?: string;
  message?: string;
};

type NamedResource = {
  id: string;
  name: string;
  region?: string;
};

export class OvhClient {
  private timeDelta: number | undefined;

  constructor(private readonly credentials: OvhCredentials) {}

  async listInstances(): Promise<OvhInstance[]> {
    return await this.request<OvhInstance[]>("GET", `/cloud/project/${this.credentials.projectId}/instance`);
  }

  async getInstance(id: string): Promise<OvhInstance> {
    return await this.request<OvhInstance>("GET", `/cloud/project/${this.credentials.projectId}/instance/${id}`);
  }

  async resolveInstance(nameOrId: string): Promise<OvhInstance> {
    if (isUuid(nameOrId)) {
      try {
        return await this.getInstance(nameOrId);
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 404) {
          throw error;
        }
      }
    }

    const matches = (await this.listInstances()).filter((instance) => instance.name === nameOrId);
    const instance = matches[0];
    if (!instance) {
      throw new CliError(`Server not found: ${nameOrId}`, "not_found");
    }
    return instance;
  }

  async createInstance(input: {
    name: string;
    flavorId: string;
    imageId: string;
    region: string;
    sshKeyId?: string;
  }): Promise<OvhInstance> {
    const payload: Record<string, unknown> = {
      name: input.name,
      flavorId: input.flavorId,
      imageId: input.imageId,
      region: input.region,
      monthlyBilling: false,
    };
    if (input.sshKeyId) {
      payload.sshKeyId = input.sshKeyId;
    }

    return await this.request<OvhInstance>(
      "POST",
      `/cloud/project/${this.credentials.projectId}/instance`,
      payload,
    );
  }

  async deleteInstance(id: string): Promise<void> {
    await this.request<void>("DELETE", `/cloud/project/${this.credentials.projectId}/instance/${id}`);
  }

  async resolveFlavorId(nameOrId: string, region: string): Promise<string> {
    if (isUuid(nameOrId)) {
      return nameOrId;
    }
    const flavors = await this.request<NamedResource[]>(
      "GET",
      `/cloud/project/${this.credentials.projectId}/flavor?region=${encodeURIComponent(region)}`,
    );
    return pickNamedId(flavors, nameOrId, "flavor");
  }

  async resolveImageId(nameOrId: string, region: string): Promise<string> {
    if (isUuid(nameOrId)) {
      return nameOrId;
    }
    const images = await this.request<NamedResource[]>(
      "GET",
      `/cloud/project/${this.credentials.projectId}/image?region=${encodeURIComponent(region)}`,
    );
    return pickNamedId(images, nameOrId, "image");
  }

  async resolveSshKeyId(nameOrId: string): Promise<string> {
    if (isUuid(nameOrId)) {
      return nameOrId;
    }
    const keys = await this.request<NamedResource[]>(
      "GET",
      `/cloud/project/${this.credentials.projectId}/sshkey`,
    );
    return pickNamedId(keys, nameOrId, "ssh key");
  }

  private async request<T>(method: string, path: string, body?: unknown, needAuth = true): Promise<T> {
    const url = `${this.credentials.endpoint}${path}`;
    const payload = body === undefined ? "" : JSON.stringify(body);
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (payload) {
      headers["Content-Type"] = "application/json";
    }

    if (needAuth) {
      const timestamp = String(Math.floor(Date.now() / 1000) + (await this.getTimeDelta()));
      headers["X-Ovh-Application"] = this.credentials.applicationKey;
      headers["X-Ovh-Consumer"] = this.credentials.consumerKey;
      headers["X-Ovh-Timestamp"] = timestamp;
      headers["X-Ovh-Signature"] = signOvhRequest({
        applicationSecret: this.credentials.applicationSecret,
        consumerKey: this.credentials.consumerKey,
        method,
        url,
        body: payload,
        timestamp,
      });
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: payload.length > 0 ? payload : undefined,
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
    let data: unknown;
    if (text.length > 0) {
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        throw new ApiError(
          `OVH API returned invalid JSON (${response.status})`,
          "invalid_response",
          response.status,
        );
      }
    }

    if (!response.ok) {
      const errorBody = data as OvhErrorBody | undefined;
      throw new ApiError(
        errorBody?.message ?? `OVH API request failed (${response.status})`,
        errorBody?.errorCode ?? "api_error",
        response.status,
      );
    }

    return data as T;
  }

  private async getTimeDelta(): Promise<number> {
    if (this.timeDelta !== undefined) {
      return this.timeDelta;
    }
    try {
      const serverTime = await this.request<number>("GET", "/auth/time", undefined, false);
      this.timeDelta = serverTime - Math.floor(Date.now() / 1000);
    } catch {
      this.timeDelta = 0;
    }
    return this.timeDelta;
  }
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function pickNamedId(items: NamedResource[], nameOrId: string, kind: string): string {
  const needle = nameOrId.toLowerCase();
  const exact = items.find((item) => item.id === nameOrId || item.name.toLowerCase() === needle);
  if (exact) {
    return exact.id;
  }
  const partial = items.filter((item) => item.name.toLowerCase().includes(needle));
  if (partial.length === 1 && partial[0]) {
    return partial[0].id;
  }
  throw new CliError(`${kind} not found: ${nameOrId}`, "not_found");
}
