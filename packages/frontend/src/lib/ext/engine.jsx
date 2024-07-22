import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ExtensionsContext = createContext();
export const ExtensionsProvider = ({ children }) => {
  const [extensions, setExtensions] = useState({});

  async function registerExtension(extension) {
    extension.hooks.onRegister && await extension.hooks.onRegister();

    setExtensions({ ...extensions, [extension.identifier]: extension });
  }

  return (
    <ExtensionsContext.Provider value={{ extensions, setExtensions, registerExtension }}>
      {children}
    </ExtensionsContext.Provider>
  );
};

ExtensionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
