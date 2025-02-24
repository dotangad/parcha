import { Hono } from "hono";
import client from "../client.ts";
import type User from "@parcha/database/Users.ts";
import { generateToken, userFromToken } from "./jwt.ts";
import { authenticated } from "./middleware.ts";

interface GoogleUserData {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  hd: string;
}

const auth = new Hono();

auth.use(async (c, next) => {
  const contentType = c.req.header("Content-Type");
  if (contentType !== "application/json") {
    return c.json({ success: false, message: "Invalid content type" }, 400);
  }
  await next();
});

auth.post("/google", async (c) => {
  try {
    const { access_token } = await c.req.json();

    const req = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
    );
    const user_data = await req.json() as GoogleUserData;
    if (!user_data.email) {
      return c.json({ success: false, message: "Bad token" }, 400);
    }
    if (!user_data.email_verified) {
      return c.json({ success: false, message: "Email not verified" }, 400);
    }

    const user = await client().query<User>(
      {
        name: "upsert-user-on-login",
        text: `insert into users (email, name, googleId, picture)
          values ($1::text, $2::text, $3::text, $4::text)
          on conflict (googleId) do update set
            email = $1::text,
            name = $2::text,
            picture = $4::text
          returning *`,
        values: [
          user_data.email,
          user_data.name,
          user_data.sub,
          user_data.picture,
        ],
      },
    );

    const token = await generateToken(user.rows[0]);
    return c.json({ success: true, message: "Database connected!", token }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
});

auth.post("/me", authenticated, (c) => {
  return c.json({ success: true, message: "Authenticated", user: c.get("user") }, 200);
});

export default auth;
