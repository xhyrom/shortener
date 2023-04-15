import { getRuntime } from "@astrojs/cloudflare/runtime";
import { APIRoute } from "astro";
import { github } from "~/lib/workers-auth-provider";

// TODO: do it
export const get: APIRoute = async ({ request }) => {
  const clientId = (getRuntime(request).env as CloudflareEnv).GITHUB_CLIENT_ID;
  console.log(clientId);
  const location = await github.redirect({
    options: {
      clientId: clientId,
    },
  });
  console.log(location);

  return new Response(null, {
    status: 302,
    headers: {
      location,
    },
  });
};
