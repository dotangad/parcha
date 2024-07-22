import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flex, Box, Input, Button, Skeleton } from "@chakra-ui/react";
import { AuthContext } from "../lib/authcontext.tsx";
import { queryDocuments } from "../lib/documents.ts";
import { ExtensionsContext } from "../lib/ext/engine.tsx";
import { TAPIResponse } from "backend/src/lib/api_types.ts";

export default function QueryDocuments() {
  const { token } = useContext(AuthContext);
  const { extensions } = useContext(ExtensionsContext)

  // FIXME: handle error
  const { data, isLoading } = useQuery({
    queryKey: ["documents.initial"],
    queryFn: queryDocuments(token as string, {
      limit: 50,
      includeTitles: true
    }),
  });

  return (
    <Box mt={8}>
      <Flex alignItems="center" gap={3}>
        <Input type="text" placeholder="Query here" bg="white" />
        <Button bg="purple.500" color="white" _hover={{ bg: "purple.700" }}>
          GET
        </Button>
      </Flex>
      {isLoading ? (
        <Flex flexDir="column" gap={2} my={8}>
          {Array(10).fill(0).map((_, i) => (
            <Skeleton key={i} height="45px" />
          ))}
        </Flex>
      ) : (
        <Box my={8} overflow="auto">
          <Flex flexDir="column" gap={4}>
            {data?.data.documents.map((doc) => {
              const extension = extensions[doc.extension];

              if (!extension) {
                // FIXME: handle
                return <></>
              }


              return <Box key={doc._id}>
                <extension.DisplayRow document={doc} />
              </Box>;
            })}
          </Flex>
        </Box>
      )}
    </Box>
  );
}