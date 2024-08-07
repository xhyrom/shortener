import type { APIRoute } from "astro";
import { createInvite, getInvites } from "~/lib/d1";
import { handleAuth } from "~/lib/utils";

export const GET: APIRoute = async ({ cookies, redirect, locals }) => {
  const db = locals.runtime.env.shortener_database;

  const authorized = await handleAuth(locals, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const invites = await getInvites(db, authorized.data.id);

  return new Response(JSON.stringify(invites), {
    status: 200,
  });
};

export const POST: APIRoute = async ({ cookies, redirect, locals }) => {
  const db = locals.runtime.env.shortener_database;

  const authorized = await handleAuth(locals, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const result = await createInvite(db, authorized.data.id);

  return new Response(
    JSON.stringify({
      data: null,
      created: result,
    }),
    {
      status: 200,
    },
  );
};
