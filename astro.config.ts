import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import compress from "@playform/compress";
import tailwind from "@astrojs/tailwind";
import { CONFIG } from "./src/config";
import svelte from "@astrojs/svelte";
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "directory",
  }),
  site: CONFIG.origin,
  base: "/",
  integrations: [
    sitemap(),
    robotsTxt({
      policy: [
        {
          userAgent: "*",
        },
      ],
      sitemap: true,
    }),
    compress({
      CSS: true,
      HTML: true,
      Image: true,
      JavaScript: true,
      SVG: true,
    }),
    tailwind(),
    svelte(),
  ],
  vite: {
    resolve: {
      alias: {
        "~": resolve(__dirname, "./src"),
      },
    },
  },
});
