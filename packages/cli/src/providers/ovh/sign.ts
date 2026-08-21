import { createHash } from "node:crypto";

export function signOvhRequest(input: {
  applicationSecret: string;
  consumerKey: string;
  method: string;
  url: string;
  body: string;
  timestamp: string;
}): string {
  const toSign = [
    input.applicationSecret,
    input.consumerKey,
    input.method.toUpperCase(),
    input.url,
    input.body,
    input.timestamp,
  ].join("+");
  return `$1$${createHash("sha1").update(toSign).digest("hex")}`;
}
