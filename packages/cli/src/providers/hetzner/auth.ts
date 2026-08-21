import { CliError } from "../../utils/errors.js";

export function getHetznerToken(): string {
  const token = process.env.HCLOUD_TOKEN?.trim() || process.env.EUROCLOUD_TOKEN?.trim();
  if (!token) {
    throw new CliError(
      "Missing API token. Set HCLOUD_TOKEN in your environment or a .env file.",
      "missing_token",
    );
  }
  return token;
}
