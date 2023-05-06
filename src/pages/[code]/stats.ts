import { APIRoute } from "astro";
import { getLinkStats, getLinks } from "../../lib/kv";
import { getRuntime } from "@astrojs/cloudflare/runtime";
import { handleAuth } from "~/lib/utils";

export const get: APIRoute = async ({ params, request, cookies, redirect }) => {
  if (!params.code)
    return new Response(
      JSON.stringify({ status: 400, error: "missing_link" }),
      {
        status: 400,
      }
    );

  const db = (getRuntime(request).env as CloudflareEnv).SHORTENER_LINKS;

  const authorized = await handleAuth(request, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const link = await getLinkStats(db, params.code);
  if (!link)
    return new Response(
      JSON.stringify({ status: 404, error: "link_not_found" }),
      {
        status: 404,
      }
    );

  return new Response(
    JSON.stringify({
      ...link,
    }),
    {
      status: 200,
    }
  );
};
