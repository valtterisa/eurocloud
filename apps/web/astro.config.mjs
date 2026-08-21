import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://valtterisa.github.io",
  base: "/eurocloud",
  trailingSlash: "never",
  integrations: [sitemap()],
});
