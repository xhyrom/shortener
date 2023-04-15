import { getRuntime } from "@astrojs/cloudflare/runtime";
import { verifyJwt } from "./jwt";
import { Account, getAccount } from "./d1";
import type { AstroGlobal } from "astro";

export const getUserIdFromJwt = async (
  jwt: string,
  secret: string
): Promise<number | null> => {
  const result = await verifyJwt(jwt, secret);

  if (!result) return null;
  // rome-ignore lint/style/noNonNullAssertion: its defined for sure
  return JSON.parse(result.payload.sub!).user_id;
};

export const handleAuth = async (
  Astro: AstroGlobal
): Promise<
  | {
      success: false;
      data: Response;
    }
  | {
      success: true;
      data: Account;
    }
> => {
  const runtime = getRuntime(Astro.request).env as CloudflareEnv;

  const userId = await getUserIdFromJwt(
    Astro.cookies.get("__hyroshortener-auth").value || "",
    runtime.JWT_SECRET
  );
  if (!userId)
    return {
      success: false,
      data: Astro.redirect("/"),
    };

  const account = await getAccount(runtime.shortener_database, userId);
  if (!account)
    return {
      success: false,
      data: Astro.redirect("/"),
    };

  return {
    success: true,
    data: account,
  };
};
