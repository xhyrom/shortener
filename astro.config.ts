import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  base: "/",
  output: "server",
  adapter: cloudflare({
    mode: "directory",
  }),
});
