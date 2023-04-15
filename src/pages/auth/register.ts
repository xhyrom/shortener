import { getRuntime } from "@astrojs/cloudflare/runtime";
import { APIRoute } from "astro";
import { deleteInvite, getInvite } from "~/lib/d1";
import { github } from "~/lib/workers-auth-provider";

export const get: APIRoute = async ({ request }) => {
  const runtime = getRuntime(request).env as CloudflareEnv;

  const inviteParam = new URL(request.url).searchParams.get("invite_code");
  const invite = inviteParam
    ? await getInvite(runtime.shortener_database, inviteParam)
    : null;
  if (!invite) return new Response("Invalid invite code", { status: 400 });

  const cookie = `__hyroshortener-invite-code=${inviteParam}; Path=/; Max-Age=${
    60 * 60 * 24
  }`;

  const location = await github.redirect({
    options: {
      clientId: runtime.GITHUB_CLIENT_ID,
    },
  });

  return new Response(null, {
    status: 302,
    headers: {
      location,
      "Set-Cookie": cookie,
    },
  });
};
