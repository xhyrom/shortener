import { APIRoute } from "astro";
import { getRuntime } from "@astrojs/cloudflare/runtime";
import { getLink, track } from "../lib/kv";
import { getIp } from "../lib/ip";

export const get: APIRoute = async ({ params, request, redirect }) => {
  if (!params.code) return redirect("https://xhyrom.dev"); // unreachable

  const db = (getRuntime(request).env as { SHORTENER: KVNamespace }).SHORTENER;

  const link = await getLink(db, params.code);
  if (!link) return redirect("https://xhyrom.dev");

  await track(db, params.code, getIp(request));

  return redirect(link.target);
};
