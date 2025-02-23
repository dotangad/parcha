import { useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Grid, GridItem, Text, Box } from "@chakra-ui/react";
import { EnsureAuthenticated } from "../lib/authcontext";
import QueryDocuments from "../components/QueryDocuments";
import Header from "../components/header";
import { ExtensionsContext } from "../lib/ext/engine";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { extensions } = useContext(ExtensionsContext);

  return (
    <div className="w-full max-w-[880px] mx-auto px-6 border-[1px] border-gray-200 rounded-lg">
      <Header />
      <div className="w-full mx-auto py-[50px]">
        <p className="font-yatra text-3xl font-normal">Welcome!</p>
        <p className="text-lg">
          पarcha is a knowledge management app for the common man. It keeps your data in your hands and provides near infinte customizability through the extension engine. It&apos;s also open source!
        </p>
      </div>
      <EnsureAuthenticated unauthenticated={() => <></>}>
        <>
          <div className="w-full mx-auto mt-10 grid grid-cols-4 gap-4">
            {Object.values(extensions).map((extension, i) => {
              return (
                <div className="aspect-w-1 aspect-h-[1.3]" key={i}>
                  <extension.Create />
                </div>
              )
            })}
          </div>
          <div className="w-full mx-auto mt-6">
            <QueryDocuments />
          </div>
        </>
      </EnsureAuthenticated>
    </div>
  );
}