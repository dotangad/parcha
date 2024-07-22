import { Flex, Image, Text, Spinner, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { icon, identifier } from "./index";
import { useContext } from "react";
import { AuthContext } from "../../authcontext";

export function Create() {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const toast = useToast();

  const { mutate, isPending } = useMutation(
    {
      mutationFn: async (noteData) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/create/${identifier}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ content: noteData }),
        });
        return response.json();
      },
      onSuccess: (data) => {
        if (data.success) {
          router.navigate({ to: `/document/${data._id}` });
        } else {
          toast({
            title: data.error,
            status: "error",
          });
        }
      },
    }
  );

  return (
    <Flex
      w="100%"
      h="100%"
      bg="gray.200"
      borderRadius="lg"
      flexDir="column"
      p={4}
      gap={6}
      alignItems="center"
      justifyContent="center"
      role="button"
      tabIndex={0}
      onMouseDown={(e) => {
        e.preventDefault();
        mutate({ title: "New Note", content: "" }); // call the mutation
      }}
      _hover={{ bg: "purple.100" }}
      _focus={{ bg: "purple.100", outlineColor: "purple.500" }}
      transition="all 0.2s ease"
      position="relative"
      overflow={"hidden"}
    >
      {isPending && (
        <Flex position="absolute" top={0} right={0} bg="#00000050" w="100%" h="100%" alignItems="center" justifyContent="center">
          <Spinner size="xl" color="white" />
        </Flex>
      )}
      <Image src={icon} h={14} w={14} />
      <Text fontSize="md" fontWeight={700} letterSpacing={"1px"} casing={"uppercase"} color="gray.700">New Note</Text>
    </Flex>
  );
}