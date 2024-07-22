import { Button } from "@chakra-ui/react";
import { generateRandomString, persistOauthState } from "../lib/auth";

function LoginWithGoogle() {
  const handleRedirect = () => {
    const authurl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    const oauthState = generateRandomString(20);
    persistOauthState(oauthState);

    const params = {
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
      response_type: "token",
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      state: oauthState,
    };

    Object.entries(params).forEach(([param, val]) =>
      authurl.searchParams.set(param, val),
    );

    window.location = authurl.toString();
  };

  return <Button onClick={handleRedirect}>Login with Google</Button>;
}

export default LoginWithGoogle;
