import { describe, expect, it } from "vitest";
import { ApiError, CliError, exitCodeOf, formatError } from "../src/utils/errors.js";

describe("errors", () => {
  it("formats CliError with its code", () => {
    expect(formatError(new CliError("nope", "missing_token"))).toEqual({
      code: "missing_token",
      message: "nope",
    });
  });

  it("formats ApiError as a CliError", () => {
    const error = new ApiError("unauthorized", "unauthorized", 401);
    expect(formatError(error)).toEqual({
      code: "unauthorized",
      message: "unauthorized",
    });
    expect(exitCodeOf(error)).toBe(1);
  });

  it("formats unknown values", () => {
    expect(formatError("boom")).toEqual({
      code: "internal_error",
      message: "Unknown error",
    });
    expect(formatError(new Error("failed"))).toEqual({
      code: "internal_error",
      message: "failed",
    });
  });

  it("uses ssh_failed exit codes from CliError", () => {
    expect(exitCodeOf(new CliError("ssh exited with code 255", "ssh_failed", 255))).toBe(255);
    expect(exitCodeOf("nope")).toBe(1);
  });
});
