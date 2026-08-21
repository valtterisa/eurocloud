export class CliError extends Error {
  readonly code: string;
  readonly exitCode: number;

  constructor(message: string, code: string, exitCode = 1) {
    super(message);
    this.name = "CliError";
    this.code = code;
    this.exitCode = exitCode;
  }
}

export class ApiError extends CliError {
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message, code, 1);
    this.name = "ApiError";
    this.status = status;
  }
}

export function formatError(error: unknown): { code: string; message: string } {
  if (error instanceof CliError) {
    return { code: error.code, message: error.message };
  }
  if (error instanceof Error) {
    return { code: "internal_error", message: error.message };
  }
  return { code: "internal_error", message: "Unknown error" };
}

export function exitCodeOf(error: unknown): number {
  if (error instanceof CliError) {
    return error.exitCode;
  }
  return 1;
}
