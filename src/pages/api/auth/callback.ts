import type { APIRoute } from "astro";
import { github } from "~/lib/workers-auth-provider";
import {
  createAccount,
  deleteInvite,
  getAccount,
  getInvite,
  updateAccount,
} from "~/lib/d1";
import { generateJwt } from "~/lib/jwt";

export const get: APIRoute = async ({ request, cookies, locals }) => {
  const env = locals.runtime.env;

  try {
    const { user } = await github.users({
      options: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
      request,
    });

    const exist = await getAccount(env.shortener_database, user.id);
    if (exist) {
      await updateAccount(
        env.shortener_database,
        user.name,
        user.id,
        user.avatar_url,
      );
    } else {
      const invite = await getInvite(
        env.shortener_database,
        cookies.get("__hyroshortener-invite-code")?.value || "",
      );
      if (!invite) return new Response("Invalid invite code", { status: 400 });

      await deleteInvite(env.shortener_database, invite.code);

      await createAccount(
        env.shortener_database,
        user.name,
        user.id,
        user.avatar_url,
      );
    }

    const jwt = await generateJwt(env.JWT_SECRET, user);

    const now = new Date();
    now.setTime(now.getTime() + 24 * 3600 * 1000);

    return new Response(null, {
      status: 302,
      headers: {
        location: "/dash/",
        "Set-Cookie": `__hyroshortener-auth=${jwt}; expires=${now.toUTCString()}; path=/;`,
      },
    });
  } catch (error) {
    return new Response(null, {
      status: 500,
    });
  }
};
