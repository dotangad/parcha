import { createFileRoute } from "@tanstack/react-router";
import { useContext, useEffect, useState, memo } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { AuthContext } from "../../../lib/authcontext";

export const Route = createFileRoute("/auth/google/cb")({
  component: GoogleCB,
});

function GoogleCB() {
  const url = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = url.get("access_token");
  const { authenticateWithGoogleToken } = useContext(AuthContext);

  useEffect(() => {
    // TODO: we might have to move this logic out of the context to handle errors
    authenticateWithGoogleToken(accessToken).then(() => {
      window.location = "/";
    });
  }, [accessToken]);

  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <Spinner size="xl"></Spinner>
    </Flex>
  );
}
