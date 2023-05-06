import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import compress from "astro-compress";
import tailwind from "@astrojs/tailwind";
import { CONFIG } from "./src/config";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "directory",
  }),
  site: CONFIG.origin,
  base: "/",
  integrations: [
    //sitemap(),
    /*robotsTxt({
      policy: [
        {
          userAgent: "*",
        },
      ],
      sitemap: true,
    }),*/
    compress({
      css: true,
      html: true,
      img: true,
      js: true,
      svg: true,
    }),
    tailwind(),
  ],
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
});
