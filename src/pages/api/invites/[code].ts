import type { APIRoute } from "astro";
import { deleteInvite, getInvite } from "~/lib/d1";
import { handleAuth } from "~/lib/utils";

export const GET: APIRoute = async ({ params, locals }) => {
  if (!params.code)
    return new Response(
      JSON.stringify({
        status: 400,
        error: "missing_code",
      }),
      { status: 400 },
    );

  const db = locals.runtime.env.shortener_database;

  const invite = await getInvite(db, params.code);
  if (!invite)
    return new Response(
      JSON.stringify({
        status: 404,
        error: "invite_not_found",
      }),
      { status: 404 },
    );

  return new Response(JSON.stringify(invite), {
    status: 200,
  });
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

  const db = locals.runtime.env.shortener_database;

  const authorized = await handleAuth(locals, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const invite = await getInvite(db, params.code);
  if (!invite)
    return new Response(
      JSON.stringify({
        status: 404,
        error: "invite_not_found",
      }),
      { status: 404 },
    );

  const result = await deleteInvite(db, params.code);

  return new Response(
    JSON.stringify({
      old_data: invite,
      deleted: result,
    }),
    {
      status: 200,
    },
  );
};
