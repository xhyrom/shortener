import * as jose from "jose";
import type { Account } from "./d1";

export const generateJwt = (jwtSecret: string, user: Account) => {
  return new jose.SignJWT({})
    .setExpirationTime(Math.floor(Date.now() / 1000) + 24 * (60 * 60))
    .setSubject(
      JSON.stringify({
        user_id: user.id,
      })
    )
    .sign(new TextEncoder().encode(jwtSecret));
};
