import { getRuntime } from "@astrojs/cloudflare/runtime";
import { APIRoute } from "astro";
import { github } from "~/lib/workers-auth-provider";

export const get: APIRoute = async ({ request }) => {
  const clientId = (getRuntime(request).env as CloudflareEnv).GITHUB_CLIENT_ID;
  const location = await github.redirect({
    options: {
      clientId: clientId,
    },
  });

  return new Response(null, {
    status: 302,
    headers: {
      location,
    },
  });
};
