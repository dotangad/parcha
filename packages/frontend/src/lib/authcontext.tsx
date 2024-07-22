import { useState, useEffect, useContext, createContext } from "react";
import { Flex, Spinner, Box } from "@chakra-ui/react";
import { User } from "backend/src/db/models.ts";

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
      const meReq = await fetch(`${import.meta.env.VITE_API_URL}/auth/me/`, {
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
    const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/`, {
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
        <Flex justify="center" align="center" h="100vh">
          <Spinner />
        </Flex>
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