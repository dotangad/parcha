import { createLazyFileRoute } from '@tanstack/react-router';
import { useContext } from "react";
import { useToast, Flex, Button, Box } from "@chakra-ui/react";
import { AuthContext } from '../../lib/authcontext.tsx';
import Header from '../../components/Header.tsx';

export const Route = createLazyFileRoute('/auth/')({
  component: AuthInfo
});

function AuthInfo() {
  const { token, user, logout } = useContext(AuthContext);
  const toast = useToast();

  return (
    <Box>
      <Header />
      <Box maxW={"800px"} mx="auto" my={8} overflow="auto">
        {token && (
          <>
            <pre style={{ width: "100vw", overflowX: "auto" }}>
              {JSON.stringify({ user, token }, null, 2)}
            </pre>
            <Flex justify="center" alignItems="center" gap={4} my={6}>
              <Button onMouseDown={() => logout()}>Logout</Button>
              <Button
                bg="purple.500"
                color="white"
                _hover={{ bg: "purple.700" }}
                onMouseDown={() =>
                  navigator.clipboard.writeText(token as string).then(() =>
                    toast({
                      title: "Token copied to clipboard",
                      status: "success",
                    }),
                  )
                }
              >
                Copy token
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
}