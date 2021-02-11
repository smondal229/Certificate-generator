import React from 'react';
import CertificatePage from './components/certificates/CertificatesPage';
import { ChakraProvider, theme } from "@chakra-ui/react"

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS={true}>
      <CertificatePage />
    </ChakraProvider>
  );
}

export default App;
