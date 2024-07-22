import { useState, useEffect, useContext, createContext } from "react";
import { Flex, Spinner, Box } from "@chakra-ui/react";
import LoginWithGoogle from "../components/LoginWithGoogle";

export const AuthContext = createContext({
  loading: true,
  token: false,
  user: false,
  authenticateWithGoogleToken: async () => false,
  logout: async () => false,
});

export default function AuthWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(false);
  const [user, setUser] = useState(false);

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

      const { user } = await meReq.json();
      setUser(user);
      setToken(lsToken);
      setLoading(false);
    })();

    return;
  }, []);

  const authenticateWithGoogleToken = async (googleToken) => {
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

    const { user, token } = await req.json();
    window.localStorage.setItem("parcha__apitoken", token);
    setUser(user);
    setToken(token);
    return;
  };

  const logout = async () => {
    setUser(false);
    setToken(false);
    window.localStorage.removeItem("parcha__apitoken");
    window.location = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        testing: "elllo",
        loading,
        token,
        user,
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

export function EnsureAuthenticated({ children, unauthenticated }) {
  const { token } = useContext(AuthContext);

  return token ? children : unauthenticated;
}