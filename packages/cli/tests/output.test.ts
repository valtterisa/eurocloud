import { afterEach, describe, expect, it } from "vitest";
import { printError, printJson, printLines, printTable } from "../src/utils/output.js";
import { CliError } from "../src/utils/errors.js";
import { captureStdio, parseJsonOutput } from "./helpers/stdio.js";

describe("output", () => {
  let stdio: ReturnType<typeof captureStdio> | undefined;

  afterEach(() => {
    stdio?.restore();
  });

  it("prints pretty JSON", () => {
    stdio = captureStdio();
    printJson({ id: 42, name: "my-app" });
    expect(parseJsonOutput(stdio.stdout())).toEqual({ id: 42, name: "my-app" });
  });

  it("prints a padded table", () => {
    stdio = captureStdio();
    printTable(
      ["ID", "NAME"],
      [
        ["42", "my-app"],
        ["7", "db"],
      ],
    );
    const lines = stdio.stdout().trimEnd().split("\n");
    expect(lines[0]).toMatch(/^ID\s+NAME/);
    expect(lines[2]).toContain("42");
    expect(lines[2]).toContain("my-app");
    expect(lines[3]).toContain("db");
  });

  it("prints human errors to stderr", () => {
    stdio = captureStdio();
    printError(new CliError("Missing API token", "missing_token"), false);
    expect(stdio.stdout()).toBe("");
    expect(stdio.stderr()).toBe("Error: Missing API token\n");
  });

  it("prints JSON errors to stdout", () => {
    stdio = captureStdio();
    printError(new CliError("Missing API token", "missing_token"), true);
    expect(parseJsonOutput(stdio.stdout())).toEqual({
      error: { code: "missing_token", message: "Missing API token" },
    });
  });

  it("prints lines with a trailing newline", () => {
    stdio = captureStdio();
    printLines(["one", "two"]);
    expect(stdio.stdout()).toBe("one\ntwo\n");
  });
});
