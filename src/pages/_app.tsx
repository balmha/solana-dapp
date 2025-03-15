import '../styles/globals.css';
import '../styles/liquidity.css';
require('@solana/wallet-adapter-react-ui/styles.css');
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Solana Token Creator | Create SPL Tokens easily - SPLForge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ContextProvider>
        <div className="w-full min-h-screen flex flex-col h-screen">
          <AppBar />
          <ContentContainer>
            <Component {...pageProps} />
          </ContentContainer>
          <Footer />
        </div>
      </ContextProvider>
    </>
  );
};

export default App;