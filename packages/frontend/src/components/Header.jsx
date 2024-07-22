import { useContext } from "react";
import { Text, Flex, Image } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router"
import { AuthContext } from "../lib/authcontext";
import LoginWithGoogle from "./LoginWithGoogle";

export default function Header() {
  const { token, user } = useContext(AuthContext);

  return (
    <Flex justifyContent="space-between" alignItems="center" pt={8} w="100%" mx="auto">
      <Flex justifyContent="center" alignItems="center" gap={4}>
        {/* <Image src="/logo256-2.png" h={8} w={8} /> */}
        <Link to="/">
          <Text fontSize="2xl" fontWeight="bold" fontFamily="yatra"><Text color="pPurple.dark" as="span">प</Text>archa</Text>
        </Link>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        {token ? (
          <Link to="/auth">
            <Image src={user.picture} h={10} w={10} rounded="full" bg="purple.500/40" />
          </Link>
        ) : (
          <LoginWithGoogle />
        )}
      </Flex>
    </Flex>
  );
}