import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://valtterisa.github.io",
  base: process.env.ASTRO_BASE ?? "/",
  trailingSlash: "never",
  integrations: [sitemap()],
});
