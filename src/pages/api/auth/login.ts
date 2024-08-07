import type { APIRoute } from "astro";
import { github } from "~/lib/workers-auth-provider";

export const GET: APIRoute = async ({ locals }) => {
  const clientId = locals.runtime.env.GITHUB_CLIENT_ID;
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
