import type { APIRoute } from "astro";
import { getLink, track } from "../../lib/kv";
import { getIp } from "../../lib/ip";

export const GET: APIRoute = async ({ params, request, redirect, locals }) => {
  if (!params.code) return redirect("https://xhyrom.dev"); // unreachable

  const db = locals.runtime.env.SHORTENER_LINKS;

  const link = await getLink(db, params.code);
  if (!link) return redirect("https://xhyrom.dev");

  await track(db, params.code, getIp(request));

  return redirect(link.target);
};
