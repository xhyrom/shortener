/// <reference types="astro/client" />

type Env = {
  // consider using better names for these keys
  SHORTENER_LINKS: KVNamespace;
  shortener_database: D1Database;
  // secrets
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  JWT_SECRET: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
