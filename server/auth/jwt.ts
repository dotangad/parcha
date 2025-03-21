import * as djwt from "@wok/djwt";
import type User from "@parcha/database/Users.ts";

// const key = await crypto.subtle.generateKey(
//   { name: "HMAC", hash: "SHA-512" },
//   true,
//   ["sign", "verify"],
// );

// await Deno.writeTextFile("./jwtkey.json", JSON.stringify(await crypto.subtle.exportKey("jwk", key)));

const keyJson = JSON.parse(await Deno.readTextFile("./jwtkey.json"));
const key = await crypto.subtle.importKey(
  "jwk",
  keyJson,
  { name: "HMAC", hash: "SHA-512" },
  keyJson.ext,
  keyJson.key_ops,
);

export async function generateToken(user: User) {
  const now = djwt.getNumericDate(new Date());
  const jwt = await djwt.create(
    {
      alg: "HS512",
      typ: "JWT",
      sub: user.email,
      exp: now + 7 * 24 * 60 * 60,
      iat: now,
    },
    { ...user },
    key,
  );

  return jwt;
}

export async function userFromToken(token: string) {
  const pd = await djwt.verify(token, key);

  return pd as unknown as User;
}