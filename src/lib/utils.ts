import { verifyJwt } from "./jwt";
import { type Account, getAccount } from "./d1";
import type { AstroCookies, AstroGlobal } from "astro";
import { customAlphabet } from "nanoid";

export const getUserIdFromJwt = async (
  jwt: string,
  secret: string,
): Promise<number | null> => {
  const result = await verifyJwt(jwt, secret);

  if (!result) return null;
  // rome-ignore lint/style/noNonNullAssertion: its defined for sure
  return JSON.parse(result.payload.sub!).user_id;
};

export const handleAuth = async (
  locals: App.Locals,
  cookies: AstroCookies,
  redirect: AstroGlobal["redirect"],
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
  const env = locals.runtime.env;

  const userId = await getUserIdFromJwt(
    cookies.get("__hyroshortener-auth")?.value || "",
    env.JWT_SECRET,
  );
  if (!userId)
    return {
      success: false,
      data: redirect("/"),
    };

  const account = await getAccount(env.shortener_database, userId);
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
  10,
);
