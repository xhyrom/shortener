import { getRuntime } from "@astrojs/cloudflare/runtime";
import { APIRoute } from "astro";
import { Link, createLink, getLinks } from "~/lib/kv";
import { handleAuth, nanoid } from "~/lib/utils";

export const get: APIRoute = async ({ request, cookies, redirect }) => {
  const db = (getRuntime(request).env as CloudflareEnv).SHORTENER_LINKS;

  const authorized = await handleAuth(request, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const links = await getLinks(db);

  return new Response(JSON.stringify(links), {
    status: 200,
  });
};

export const post: APIRoute = async ({ request, cookies, redirect }) => {
  const body = (await request.json()) as Link;
  if (!body.target)
    return new Response(
      JSON.stringify({ status: 400, error: "missing_target" }),
      {
        status: 400,
      }
    );

  const db = (getRuntime(request).env as CloudflareEnv).SHORTENER_LINKS;

  const authorized = await handleAuth(request, cookies, redirect);
  if (!authorized.success) return authorized.data;

  const { code, target, ttl } = {
    code: body.code || nanoid(6),
    target: body.target,
    ttl: body.ttl || undefined,
  };

  const result = await createLink(db, code, target, ttl);

  return new Response(
    JSON.stringify({
      data: result,
      created: result || false,
    }),
    {
      status: 200,
    }
  );
};
