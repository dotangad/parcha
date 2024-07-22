
/* eslint-disable react/prop-types */
import { Flex, Text, Box } from "@chakra-ui/react";
import moment from "moment";
import { Link } from "@tanstack/react-router";
import { Document } from "backend/src/db/models.ts";
import { TContent as TNoteContent } from "backend/extensions/notes/index.ts";

export function DisplayRow({ document }: { document: Document }) {
  return (
    <Flex
      as={Link}
      to={`/documents/${document._id}`}
      alignItems="center"
      justifyContent="space-between"
      px={4}
      py={4}
      bg="white"
      rounded="md"
      shadow="xs"
      gap={3}
      role="button"
      tabIndex={0}
      _hover={{
        bg: "white",
        shadow: "md"
      }}
      transition={"all 0.2s ease"}
    >
      <Text casing="uppercase" fontSize="sm" fontWeight={600} color="gray.500" lineHeight={1} pt={"4px"}>
        Note
      </Text>
      <Box flex={1}>
        <Text lineHeight={1} fontSize="md" fontWeight="600" fontFamily="display">{document.content.title as string}</Text>
      </Box>
      <Text fontSize="sm" color="gray.500" fontWeight={500} lineHeight={1}>
        {moment(document.updatedAt).fromNow()}
      </Text>
    </Flex>
  );
}