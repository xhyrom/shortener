import { getRuntime } from "@astrojs/cloudflare/runtime";
import { APIRoute } from "astro";
import { github } from "~/lib/workers-auth-provider";
import { createAccount } from "~/lib/d1";
import { generateJwt } from "~/lib/jwt";

export const get: APIRoute = async ({ request }) => {
  const runtime = getRuntime(request).env as CloudflareEnv;

  const { user } = await github.users({
    options: {
      clientId: runtime.GITHUB_CLIENT_ID,
      clientSecret: runtime.GITHUB_CLIENT_SECRET,
    },
    request,
  });

  console.log(user);

  await createAccount(
    runtime.shortener_database,
    user.name,
    user.id,
    user.avatar_url,
    ""
  );
  const jwt = await generateJwt(runtime.JWT_SECRET, user);

  const now = new Date();
  now.setTime(now.getTime() + 24 * 3600 * 1000);

  return new Response(null, {
    status: 302,
    headers: {
      location: "/dash",
      "Set-Cookie": `__hyroshortener-auth=${jwt}; expires=${now.toUTCString()}; path=/;`,
    },
  });
};
