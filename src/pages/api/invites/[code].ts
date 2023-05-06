import { getRuntime } from "@astrojs/cloudflare/runtime";
import { APIRoute } from "astro";
import { deleteInvite, getInvite } from "~/lib/d1";
import { handleAuth } from "~/lib/utils";

export const get: APIRoute = async ({ request, params }) => {
  if (!params.code)
    return new Response(
      JSON.stringify({
        status: 400,
        error: "missing_code",
      }),
      { status: 400 }
    );

  const db = (getRuntime(request).env as CloudflareEnv).shortener_database;

  const invite = await getInvite(db, params.code);
  if (!invite)
    return new Response(
      JSON.stringify({
        status: 404,
        error: "invite_not_found",
      }),
      { status: 404 }
    );

  return new Response(JSON.stringify(invite), {
    status: 200,
  });
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

  const db = (getRuntime(request).env as CloudflareEnv).shortener_database;

  const authorized = await handleAuth(request, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const invite = await getInvite(db, params.code);
  if (!invite)
    return new Response(
      JSON.stringify({
        status: 404,
        error: "invite_not_found",
      }),
      { status: 404 }
    );

  const result = await deleteInvite(db, params.code);

  return new Response(
    JSON.stringify({
      old_data: invite,
      deleted: result,
    }),
    {
      status: 200,
    }
  );
};
