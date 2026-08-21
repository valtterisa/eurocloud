import type { APIRoute } from "astro";
import { withBase } from "../lib/url";

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://valtterisa.github.io");
  const sitemap = new URL(withBase("/sitemap-index.xml"), origin).toString();
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
