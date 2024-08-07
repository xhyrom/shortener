import type { APIRoute } from "astro";
import { getLinkStats } from "../../lib/kv";
import { handleAuth } from "~/lib/utils";

export const GET: APIRoute = async ({ params, cookies, redirect, locals }) => {
  if (!params.code)
    return new Response(
      JSON.stringify({ status: 400, error: "missing_link" }),
      {
        status: 400,
      },
    );

  const db = locals.runtime.env.SHORTENER_LINKS;

  const authorized = await handleAuth(locals, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const link = await getLinkStats(db, params.code);
  if (!link)
    return new Response(
      JSON.stringify({ status: 404, error: "link_not_found" }),
      {
        status: 404,
      },
    );

  return new Response(
    JSON.stringify({
      ...link,
    }),
    {
      status: 200,
    },
  );
};
