import { getRuntime } from "@astrojs/cloudflare/runtime";
import { verifyJwt } from "./jwt";
import { Account, getAccount } from "./d1";
import type { AstroCookies, AstroGlobal } from "astro";
import { customAlphabet } from "nanoid";

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
  request: Request,
  cookies: AstroCookies,
  redirect: AstroGlobal["redirect"]
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
  const runtime = getRuntime(request).env as CloudflareEnv;

  const userId = await getUserIdFromJwt(
    cookies.get("__hyroshortener-auth").value || "",
    runtime.JWT_SECRET
  );
  if (!userId)
    return {
      success: false,
      data: redirect("/"),
    };

  const account = await getAccount(runtime.shortener_database, userId);
  if (!account)
    return {
      success: false,
      data: redirect("/"),
    };

  return {
    success: true,
    data: account,
  };
};

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10
);
