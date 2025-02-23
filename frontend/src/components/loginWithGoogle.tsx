import { Button } from "@/components/ui/button";
import { generateRandomString, persistOauthState } from "@/lib/authcontext.tsx";

function LoginWithGoogle() {
  const handleRedirect = () => {
    const authurl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    const oauthState = generateRandomString(20);
    persistOauthState(oauthState);

    const params = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      response_type: "token",
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      state: oauthState,
    };

    Object.entries(params).forEach(([param, val]) =>
      authurl.searchParams.set(param, val!),
    );

    window.location.href = authurl.toString();
  };

  return <Button onClick={handleRedirect}>Login with Google</Button>;
}

export default LoginWithGoogle;
