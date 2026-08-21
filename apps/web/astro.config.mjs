import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://eurocloud.dev",
  trailingSlash: "never",
  integrations: [sitemap()],
});
