import { getRuntime } from "@astrojs/cloudflare/runtime";
import { APIRoute } from "astro";
import { deleteLink, getLink } from "~/lib/kv";
import { handleAuth } from "~/lib/utils";

export const get: APIRoute = ({ redirect, params }) => {
  return redirect(`/${params.code}`);
};

export const del: APIRoute = async ({ request, cookies, redirect, params }) => {
  if (!params.code)
    return new Response(
      JSON.stringify({
        status: 400,
        error: "missing_code",
      }),
      { status: 400 }
    );

  const db = (getRuntime(request).env as CloudflareEnv).SHORTENER_LINKS;

  const authorized = await handleAuth(request, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const link = await getLink(db, params.code);
  if (!link)
    return new Response(
      JSON.stringify({
        status: 404,
        error: "link_not_found",
      }),
      { status: 404 }
    );

  const result = await deleteLink(db, params.code);

  return new Response(
    JSON.stringify({
      old_data: link,
      deleted: result,
    }),
    {
      status: 200,
    }
  );
};
