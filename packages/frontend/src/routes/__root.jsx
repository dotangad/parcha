import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ChakraProvider, extendTheme, Box } from "@chakra-ui/react";
import AuthWrapper from "../lib/authcontext";
import { ExtensionsProvider, ExtensionsContext } from "../lib/ext/engine";
import notesExtension from "../lib/ext/notes";

const theme = extendTheme({
  colors: {
    pPurple: {
      dark: "#850F8D",
      light: "#C7C3E2",
    }
  },
  fonts: {
    yatra: "'Yatra One', system-ui",
    body: "'Open Sans', system-ui",
    display: "'Playfair Display', system-ui",
  },
});

const queryClient = new QueryClient();

function Contexts({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ExtensionsProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </ExtensionsProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

Contexts.propTypes = {
  children: PropTypes.node.isRequired,
};

function RegisterExtensions() {
  const { registerExtension } = useContext(ExtensionsContext);

  useEffect(() => {
    registerExtension(notesExtension);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>
}

export const Route = createRootRoute({
  component: () => (
    <>
      <Contexts>
        <RegisterExtensions />
        <Box minW="100vw" minH="100vh" bg="gray.100">
          <Outlet />
        </Box>
        <TanStackRouterDevtools />
      </Contexts>
    </>
  ),
});
