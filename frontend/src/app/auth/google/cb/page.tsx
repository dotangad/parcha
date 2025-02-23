"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/lib/authcontext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Google() {
  const url = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = url.get("access_token");
  const { authenticateWithGoogleToken } = useContext(AuthContext);

  useEffect(() => {
    // TODO: we might have to move this logic out of the context to handle errors
    authenticateWithGoogleToken(accessToken as string).then(() => {
      window.location.href = "/";
    });
  }, [accessToken]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
