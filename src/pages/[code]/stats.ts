import { APIRoute } from "astro";
import { getLinkStats, getLinks } from "../../lib/kv";
import { getRuntime } from "@astrojs/cloudflare/runtime";

export const get: APIRoute = async ({ params, request }) => {
  if (!params.code)
    return new Response(
      JSON.stringify({ status: 404, error: "link_not_found" }),
      {
        status: 404,
      }
    );

  const db = (getRuntime(request).env as CloudflareEnv).SHORTENER_LINKS;

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
