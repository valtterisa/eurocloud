import { describe, expect, it } from "vitest";
import { buildSshArgs, parseSshPort } from "../src/commands/ssh.js";
import { CliError } from "../src/utils/errors.js";

describe("ssh helpers", () => {
  it("builds native ssh args", () => {
    expect(buildSshArgs("root", "203.0.113.10", 22)).toEqual(["-p", "22", "root@203.0.113.10"]);
    expect(buildSshArgs("ubuntu", "203.0.113.10", 2222)).toEqual(["-p", "2222", "ubuntu@203.0.113.10"]);
  });

  it("accepts valid ports", () => {
    expect(parseSshPort("22")).toBe(22);
    expect(parseSshPort("1")).toBe(1);
    expect(parseSshPort("65535")).toBe(65535);
  });

  it("rejects invalid ports", () => {
    for (const value of ["0", "65536", "22.5", "abc", ""]) {
      expect(() => parseSshPort(value)).toThrow(CliError);
      expect(() => parseSshPort(value)).toThrow(/Invalid SSH port/);
    }
  });
});
