import { afterEach, describe, expect, it } from "vitest";
import { getOvhCredentials, resolveOvhEndpoint } from "../../src/providers/ovh/auth.js";
import { CliError } from "../../src/utils/errors.js";

const saved = {
  key: process.env.OVH_APPLICATION_KEY,
  secret: process.env.OVH_APPLICATION_SECRET,
  consumer: process.env.OVH_CONSUMER_KEY,
  project: process.env.OVH_PROJECT_ID,
  cloudProject: process.env.OVH_CLOUD_PROJECT,
  endpoint: process.env.OVH_ENDPOINT,
};

describe("OVH auth", () => {
  afterEach(() => {
    restore("OVH_APPLICATION_KEY", saved.key);
    restore("OVH_APPLICATION_SECRET", saved.secret);
    restore("OVH_CONSUMER_KEY", saved.consumer);
    restore("OVH_PROJECT_ID", saved.project);
    restore("OVH_CLOUD_PROJECT", saved.cloudProject);
    restore("OVH_ENDPOINT", saved.endpoint);
  });

  it("defaults to the EU endpoint", () => {
    delete process.env.OVH_ENDPOINT;
    expect(resolveOvhEndpoint()).toBe("https://eu.api.ovh.com/1.0");
  });

  it("maps ovh-us and ovh-ca endpoints", () => {
    expect(resolveOvhEndpoint("ovh-us")).toBe("https://api.us.ovhcloud.com/1.0");
    expect(resolveOvhEndpoint("ovh-ca")).toBe("https://ca.api.ovh.com/1.0");
  });

  it("accepts a full API URL", () => {
    expect(resolveOvhEndpoint("https://api.eu.ovhcloud.com/v1")).toBe("https://api.eu.ovhcloud.com/v1");
  });

  it("requires application keys and project id", () => {
    delete process.env.OVH_APPLICATION_KEY;
    delete process.env.OVH_APPLICATION_SECRET;
    delete process.env.OVH_CONSUMER_KEY;
    delete process.env.OVH_PROJECT_ID;
    delete process.env.OVH_CLOUD_PROJECT;
    expect(() => getOvhCredentials()).toThrow(CliError);
    expect(() => getOvhCredentials()).toThrow(/OVH_APPLICATION_KEY/);
  });

  it("reads OVH credentials from the environment", () => {
    process.env.OVH_APPLICATION_KEY = "ak";
    process.env.OVH_APPLICATION_SECRET = "as";
    process.env.OVH_CONSUMER_KEY = "ck";
    process.env.OVH_PROJECT_ID = "proj";
    delete process.env.OVH_ENDPOINT;
    expect(getOvhCredentials()).toMatchObject({
      applicationKey: "ak",
      applicationSecret: "as",
      consumerKey: "ck",
      projectId: "proj",
      endpoint: "https://eu.api.ovh.com/1.0",
    });
  });
});

function restore(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}
