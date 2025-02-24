import type { Context, Next } from "hono";
import { userFromToken } from "./jwt.ts";

export const authenticated = async (c: Context, next: Next) => {
  const token = (c.req.header("Authorization")?.split(" ") ?? [null, null])[1];
  if (!token) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }
  const user = await userFromToken(token);
  c.set("user", user);
  await next();
};