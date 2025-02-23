"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { User } from "backend/src/db/models";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { cn } from "./utils";

export function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let final = "";

  for (let i = 0; i < length; i++) {
    final += chars[Math.floor(Math.random() * (chars.length + 1))];
  }

  return final;
}

export function persistOauthState(state: string): void {
  localStorage.setItem("parcha__google_oauth_state", state);
}

export function compareOauthState(state: string, clean: boolean): boolean {
  const original = localStorage.getItem("parcha__google_oauth_state");
  if (clean) localStorage.removeItem("parcha__google_oauth_state");
  if (!original) {
    throw new Error("No previous state to compare against");
  }

  if (original === state) {
    return true;
  }

  return false;
}


export const AuthContext = createContext<{
  loading: boolean;
  token: boolean | string;
  user: boolean | User;
  authenticateWithGoogleToken: (googleToken: string) => Promise<unknown>;
  logout: () => Promise<unknown>;
}>({
  loading: true,
  token: false,
  user: false,
  authenticateWithGoogleToken: async () => false,
  logout: async () => false,
});

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<boolean | string>(false);
  const [user, setUser] = useState<boolean | object>(false);

  // TODO:
  // --> check localstorage for token
  // --> check validity of token (/api/auth/me)
  // --> save valid user object to context

  useEffect(() => {
    const lsToken = window.localStorage.getItem("parcha__apitoken");
    if (!lsToken) {
      // TODO: invalidate react query cachce
      setLoading(false);
      setToken(false);
      setUser(false);
      return;
    }

    (async function () {
      // console.log(lsToken);
      const meReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${lsToken}`,
        }),
      });

      if (meReq.status !== 200) {
        // TODO: invalidate react query cachce
        setLoading(false);
        setToken(false);
        setUser(false);
        return;
      }

      const { data: { user } } = await meReq.json();
      setUser(user);
      setToken(lsToken);
      setLoading(false);
    })();

    return;
  }, []);

  const authenticateWithGoogleToken = async (googleToken: string) => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: googleToken }),
    });

    if (req.status !== 200) {
      console.log(req);
      // TODO: handle errors
      return;
    }

    const { data: { user, token } } = await req.json();
    window.localStorage.setItem("parcha__apitoken", token);
    setUser(user);
    setToken(token);
    return;
  };

  const logout = async () => {
    setUser(false);
    setToken(false);
    window.localStorage.removeItem("parcha__apitoken");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        token,
        user: user as User,
        authenticateWithGoogleToken,
        logout,
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner className={cn("animate-spin", "h-[100px]", "w-[100px]")} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function EnsureAuthenticated({ children, unauthenticated }: { children: React.ReactNode; unauthenticated: React.ReactNode }) {
  const { token } = useContext(AuthContext);

  return token ? children : unauthenticated;
}