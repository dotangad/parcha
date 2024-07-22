import React, { createContext, useState } from 'react';
import z from "zod";
import { Document } from "backend/src/db/models.ts";

export type TFrontendExtension = {
  icon: string;
  name: string;
  identifier: string;
  description: string;
  version: string;
  contentSchema: z.AnyZodObject;
  hooks: {
    onRegister: () => Promise<unknown>;
  },
  EditPage: React.ComponentType<{ document: Document }>;
  DisplayRow: React.ComponentType<{ document: Document }>;
  Create: React.ComponentType<{ document: Document }>;
};

export const ExtensionsContext = createContext<{
  extensions: Record<string, TFrontendExtension>;
  setExtensions: (extensions: Record<string, TFrontendExtension>) => void;
  registerExtension: (extension: TFrontendExtension) => void;
}>({
  extensions: {},
  setExtensions: () => {},
  registerExtension: () => {},
});

export const ExtensionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [extensions, setExtensions] = useState({});

  async function registerExtension(extension: TFrontendExtension) {
    extension.hooks.onRegister && await extension.hooks.onRegister();

    setExtensions({ ...extensions, [extension.identifier]: extension });
  }

  return (
    <ExtensionsContext.Provider value={{ extensions, setExtensions, registerExtension }}>
      {children}
    </ExtensionsContext.Provider>
  );
};
