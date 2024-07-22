import { useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Grid, GridItem, Text, Box } from "@chakra-ui/react";
import { EnsureAuthenticated } from "../lib/authcontext";
import QueryDocuments from "../components/QueryDocuments";
import Header from "../components/Header";
import { ExtensionsContext } from "../lib/ext/engine";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { extensions } = useContext(ExtensionsContext);

  return (
    <Box w={"100%"} maxW="880px" mx="auto" px={6}>
      <Header />
      <Box w={"100%"} mx="auto" my={8}>
        <Text fontFamily="yatra" fontSize="4xl" fontWeight={400}>Welcome!</Text>
        <Text fontSize="lg">
          पarcha is a knowledge management app for the common man. It keeps your data in your hands and provides near infinte customizability through the extension engine. It&apos;s also open source!
        </Text>
      </Box>
      <EnsureAuthenticated unauthenticated={() => <></>}>
        <>
          <Grid w={"100%"} mx="auto" mt={10} templateColumns="repeat(4, 1fr)">
            {Object.values(extensions).map((extension, i) => {
              return (
                <GridItem aspectRatio={1.3} key={i}>
                  <extension.Create />
                </GridItem>
              )
            })}
          </Grid>
          <Box w={"100%"} mx="auto" mt={6}>
            <QueryDocuments />
          </Box>
        </>
      </EnsureAuthenticated>
    </Box>
  );
}