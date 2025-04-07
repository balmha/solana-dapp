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
import Script from "next/script";
import { WebApplication, WithContext } from "schema-dts";
import { Toaster } from 'react-hot-toast';

const jsonLd: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SPLForge",
  description: "Create token on Solana. Easily create and manage SPL tokens and liquidity pools with SPLForge. No-code, simple, fast, and user-friendly.",
  url: "https://splforge.xyz/",
  applicationCategory: "Finance",
  applicationSubCategory: "Cryptocurrency",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript. Requires modern web browser.",
  image: "https://splforge.xyz/hammerhead-real.png",
  inLanguage: "en",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  potentialAction: {
    "@type": "ViewAction",
    target: "https://splforge.xyz/",
  },
  sameAs: [
    "https://twitter.com/splforge",
    "https://www.facebook.com/profile.php?id=61574385838648",
    "https://www.instagram.com/splforge/",
    "https://www.youtube.com/@SPLForge",
    "https://www.linkedin.com/in/splforge/",
    "https://dev.to/splforge",
  ]
};

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Script
        id="webapplication-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <Head>
        <title>Create Solana Token | Create SPL Tokens easily - SPLForge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Create token on Solana. Easily create and manage SPL tokens and liquidity pools with SPLForge. No-code, simple, fast, and user-friendly." />
        <meta property="og:url" content="https://splforge.xyz/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Solana Token Creator | Create SPL Tokens easily - SPLForge" />
        <meta property="og:description" content="Create token on Solana. Easily create and manage SPL tokens and liquidity pools with SPLForge. No-code, simple, fast, and user-friendly." />
        <meta property="og:image" content="https://splforge.xyz/hammerhead-real.png" />
        <meta property="og:image:alt" content="SPLForge hammerhead shark logo" />
        <link rel="canonical" href="https://splforge.xyz/" />
        <link rel="icon" href="https://splforge.xyz/favicon.ico"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="https://splforge.xyz/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://splforge.xyz/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://splforge.xyz/apple-touch-icon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SPLForge" />
        <meta name="twitter:description" content="Create token on Solana. Easily create and manage SPL tokens and liquidity pools with SPLForge. No-code, simple, fast, and user-friendly." />
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
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            maxWidth: '500px',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap'
          }
        }}
      />
    </>
  );
};

export default App;