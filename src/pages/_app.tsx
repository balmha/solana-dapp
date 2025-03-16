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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Create and Manage Tokens on Solana. Easily create SPL tokens and liquidity pools with SPLForge. No-code, simple, fast, and user-friendly." />
        <meta property="og:url" content="https://splforge.xyz/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Solana Token Creator | Create SPL Tokens easily - SPLForge" />
        <meta property="og:description" content="Create and Manage Tokens on Solana. Easily create SPL tokens and liquidity pools with SPLForge. No-code, simple, fast, and user-friendly." />
        <meta property="og:image" content="https://splforge.xyz/hammerhead-real.png" />
        <meta property="og:image:alt" content="SPLForge hammerhead shark logo" />
        <link rel="canonical" href="https://splforge.xyz/" />
        <link rel="icon" href="https://splforge.xyz/favicon.ico"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="https://splforge.xyz/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://splforge.xyz/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://splforge.xyz/apple-touch-icon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SPLForge" />
        <meta name="twitter:description" content="Create and Manage Tokens on Solana. Easily create SPL tokens and liquidity pools with SPLForge. No-code, simple, fast, and user-friendly." />
        <meta name="twitter:image" content="https://splforge.xyz/hammerhead-real.png" />
        <meta name="twitter:site" content="@splforge" />
        <meta name="twitter:creator" content="@splforge" />
      </Head>
      <ContextProvider>
        <div className="flex flex-col min-h-screen">
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