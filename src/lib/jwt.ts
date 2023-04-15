import * as jose from "jose";
import type { Account } from "./d1";

export const generateJwt = (jwtSecret: string, user: Account) => {
  return new jose.SignJWT({})
    .setExpirationTime(Math.floor(Date.now() / 1000) + 24 * (60 * 60))
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(
      JSON.stringify({
        user_id: user.id,
      })
    )
    .sign(new TextEncoder().encode(jwtSecret));
};

export const verifyJwt = async (
  jwt: string,
  secret: string
): Promise<jose.JWTVerifyResult | null> => {
  if (!jwt) return null;

  try {
    return await jose.jwtVerify(jwt, new TextEncoder().encode(secret));
  } catch {
    return null;
  }
};
