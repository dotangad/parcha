import { useContext } from "react";
import { createLazyFileRoute, Navigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query"
import { Spinner, Box } from "@chakra-ui/react";
import { AuthContext, EnsureAuthenticated } from "../../lib/authcontext";
import Header from "../../components/Header";
import { ExtensionsContext } from "../../lib/ext/engine";
import { fetchDocumentById } from "../../lib/documents";

export const Route = createLazyFileRoute('/documents/$id')({
  component: DocumentPage
})

function DocumentPage() {
  const { extensions } = useContext(ExtensionsContext);
  const { token } = useContext(AuthContext);
  const { id } = useParams({ strict: false });
  const { data, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: fetchDocumentById(token, id),
  });

  return (
    <EnsureAuthenticated unauthenticated={() => <Navigate to={"/"} />}>
      <Box w={"100%"} maxW="880px" mx="auto" px={6}>
        <Header />
        <Box w={"100%"} mx="auto" mt={12}>
          {/* FIXME: handle 404s */}
          {isLoading
            ? <Spinner />
            : (() => {
              const extension = extensions[data.document.extension]
              return <extension.EditPage document={data.document} />
            })()}
        </Box>
      </Box>
    </EnsureAuthenticated>
  );
}