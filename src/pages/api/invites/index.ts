import { getRuntime } from "@astrojs/cloudflare/runtime";
import { APIRoute } from "astro";
import { createInvite, getInvites } from "~/lib/d1";
import { handleAuth } from "~/lib/utils";

export const get: APIRoute = async ({ request, cookies, redirect }) => {
  const db = (getRuntime(request).env as CloudflareEnv).shortener_database;

  const authorized = await handleAuth(request, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const invites = await getInvites(db, authorized.data.id);

  return new Response(JSON.stringify(invites), {
    status: 200,
  });
};

export const post: APIRoute = async ({ request, cookies, redirect }) => {
  const db = (getRuntime(request).env as CloudflareEnv).shortener_database;

  const authorized = await handleAuth(request, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const result = await createInvite(db, authorized.data.id);

  return new Response(
    JSON.stringify({
      data: null,
      created: result,
    }),
    {
      status: 200,
    }
  );
};
