import { createFileRoute } from "@tanstack/react-router";
import { useContext, useEffect, useState, memo } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { AuthContext } from "../../../lib/authcontext.tsx";

export const Route = createFileRoute("/auth/google/cb")({
  component: GoogleCB,
});

function GoogleCB() {
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
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <Spinner size="xl"></Spinner>
    </Flex>
  );
}
