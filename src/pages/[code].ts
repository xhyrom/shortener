import { APIRoute } from "astro";
import { getRuntime } from "@astrojs/cloudflare/runtime";
import { getLink } from "../lib/kv";

export const get: APIRoute = async ({ params, request, redirect }) => {
  if (!params.code) return redirect("https://xhyrom.dev"); // unreachable

  const db = (getRuntime(request).env as { SHORTENER: KVNamespace }).SHORTENER;

  const link = await getLink(db, params.code);
  if (!link) return redirect("https://xhyrom.dev");

  // TODO: add tracking
  return redirect(link.target);
};
