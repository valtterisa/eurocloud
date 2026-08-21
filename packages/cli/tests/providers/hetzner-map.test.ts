import { describe, expect, it } from "vitest";
import { mapHetznerServer, type HetznerServer } from "../../src/providers/hetzner/map.js";

const sample: HetznerServer = {
  id: 42,
  name: "my-app",
  status: "running",
  public_net: {
    ipv4: { ip: "203.0.113.10" },
    ipv6: { ip: "2a01:4f8:0:1::1" },
  },
  server_type: { name: "cpx11" },
  datacenter: {
    name: "nbg1-dc3",
    location: { name: "nbg1" },
  },
  image: { name: "ubuntu-24.04", description: "Ubuntu 24.04" },
  created: "2026-08-21T08:00:00+00:00",
};

describe("mapHetznerServer", () => {
  it("flattens Hetzner payloads into summaries", () => {
    expect(mapHetznerServer(sample)).toEqual({
      id: "42",
      name: "my-app",
      status: "running",
      type: "cpx11",
      image: "ubuntu-24.04",
      location: "nbg1",
      ipv4: "203.0.113.10",
      ipv6: "2a01:4f8:0:1::1",
      created: "2026-08-21T08:00:00+00:00",
      provider: "hetzner",
    });
  });

  it("uses null for missing image and IPs", () => {
    const summary = mapHetznerServer({
      ...sample,
      image: null,
      public_net: { ipv4: null, ipv6: null },
    });
    expect(summary.image).toBeNull();
    expect(summary.ipv4).toBeNull();
    expect(summary.ipv6).toBeNull();
  });
});
