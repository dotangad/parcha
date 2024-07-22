import { Box, Flex, Text, Spinner, Input, useToast } from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import * as _ from "lodash";
import { EditorState, $getRoot, $getSelection } from 'lexical';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../authcontext.tsx';
import { Document } from "backend/src/db/models.ts";

// FIXME: NOTHING WORKS!!!

import "./editor.css";


const theme = {
  // Theme styling goes here
  //...
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: unknown) {
  console.error(error);
}

export function EditPage({ document }: { document: Document }) {
  const [title, setTitle] = useState(document.content.title);
  const [editorState, setEditorState] = useState<EditorState>();
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const toast = useToast();


  const updateM = useMutation(
    {
      mutationFn: async (content: EditorState) => {
        if (_.isEqual({ title, content }, document.content)) {
          return { success: true, document };
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/update/${document._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ content: { title, content } }),
        });

        if (!response.ok) {
          throw new Error('Failed to update document');
        }

        console.log("REQUEST SENT")

        return await response.json();
      },
      onSuccess: (data) => {
        queryClient.setQueryData(["document", document._id], () => data);
      },
      onError: (error) => {
        console.error('Error updating document:', error);
        toast({
          title: "Error updating document.",
          description: "There was an error updating your document. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  );

  return <Box>
    <Flex alignItems="center" justifyContent={"space-between"}>
      <Text
        casing="uppercase"
        fontSize="md"
        fontWeight={800}
        color="gray.500"
        lineHeight={1}
        pt={"4px"}
      >
        Note
      </Text>
      {updateM.isPending ? (
        <Flex alignItems="center">
          <Spinner size="sm" />
          <Text ml={2}>Saving...</Text>
        </Flex>
      ) : (
        <Flex
          alignItems="center"
          onClick={() => updateM.mutate(editorState!)}
          cursor="pointer">
          <Box
            width="10px"
            height="10px"
            borderRadius="50%"
            bg={_.isEqual(document.content, { title, content: editorState })
              ? "green.500"
              : "red.500"}
          />
          <Text ml={2}>
            {_.isEqual(document.content, { title, content: editorState })
              ? "Saved"
              : "Unsaved Changes"}
          </Text>
        </Flex>
      )}
    </Flex>
    {/* TODO: show note meta */}
    <Box mt={6}>
      <Input
        value={title as string}
        onChange={(e) => setTitle(e.target.value)}
        size="2xl"
        fontSize="2xl"
        fontWeight={800}
        color="gray.700"
        bg="white"
        rounded="lg"
        lineHeight={1}
        p={"20px"}
        mt={0}
        mb={4}
      />
      <Box className="lexical">
        <LexicalComposer initialConfig={{
          namespace: 'parcha-note',
          theme,
          onError,
        }}>
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={<div>Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={(es) => {
            console.log(es);
            setEditorState(es);
          }} />
        </LexicalComposer>
      </Box>
    </Box>
  </Box >
}
