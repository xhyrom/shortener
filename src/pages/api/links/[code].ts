import type { APIRoute } from "astro";
import { deleteLink, getLink } from "~/lib/kv";
import { handleAuth } from "~/lib/utils";

export const GET: APIRoute = ({ redirect, params }) => {
  return redirect(`/${params.code}`);
};

export const DELETE: APIRoute = async ({ cookies, redirect, params, locals }) => {
  if (!params.code)
    return new Response(
      JSON.stringify({
        status: 400,
        error: "missing_code",
      }),
      { status: 400 },
    );

  const db = locals.runtime.env.SHORTENER_LINKS;

  const authorized = await handleAuth(locals, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const link = await getLink(db, params.code);
  if (!link)
    return new Response(
      JSON.stringify({
        status: 404,
        error: "link_not_found",
      }),
      { status: 404 },
    );

  const result = await deleteLink(db, params.code);

  return new Response(
    JSON.stringify({
      old_data: link,
      deleted: result,
    }),
    {
      status: 200,
    },
  );
};
