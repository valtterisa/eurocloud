import { describe, expect, it } from "vitest";
import { mapOvhInstance, type OvhInstance } from "../../src/providers/ovh/map.js";
import { signOvhRequest } from "../../src/providers/ovh/sign.js";

const sample: OvhInstance = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "my-app",
  status: "ACTIVE",
  region: "GRA11",
  created: "2026-08-21T08:00:00+00:00",
  flavor: { id: "flavor-1", name: "b2-7" },
  image: { id: "image-1", name: "Ubuntu 24.04" },
  ipAddresses: [
    { ip: "203.0.113.20", type: "public", version: 4 },
    { ip: "2001:db8::1", type: "public", version: 6 },
  ],
};

describe("signOvhRequest", () => {
  it("builds the OVH $1$ sha1 signature", () => {
    const signature = signOvhRequest({
      applicationSecret: "as",
      consumerKey: "ck",
      method: "GET",
      url: "https://eu.api.ovh.com/1.0/me",
      body: "",
      timestamp: "1700000000",
    });
    expect(signature).toMatch(/^\$1\$[a-f0-9]{40}$/);
    expect(
      signOvhRequest({
        applicationSecret: "as",
        consumerKey: "ck",
        method: "GET",
        url: "https://eu.api.ovh.com/1.0/me",
        body: "{}",
        timestamp: "1700000000",
      }),
    ).not.toBe(signature);
  });
});

describe("mapOvhInstance", () => {
  it("maps public IPs and flavor/image names", () => {
    expect(mapOvhInstance(sample)).toEqual({
      id: "11111111-1111-1111-1111-111111111111",
      name: "my-app",
      status: "ACTIVE",
      type: "b2-7",
      image: "Ubuntu 24.04",
      location: "GRA11",
      ipv4: "203.0.113.20",
      ipv6: "2001:db8::1",
      created: "2026-08-21T08:00:00+00:00",
      provider: "ovh",
    });
  });
});
