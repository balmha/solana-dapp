import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Token Creator | Create SPL Token Fast &amp; Cheap - SPLForge</title>
        <meta
          name="description"
          content="The ultimate Solana token creator. Create an SPL token, make a Solana coin, and use a cheap Solana token builder with no coding required."
        />
        <meta property="og:title" content="Solana Token Creator | Create SPL Token Fast &amp; Cheap - SPLForge" />
        <meta property="og:description" content="The ultimate Solana token creator. Create an SPL token, make a Solana coin, and use a cheap Solana token builder with no coding required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://splforge.xyz/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solana Token Creator | Create SPL Token Fast &amp; Cheap - SPLForge" />
        <meta name="twitter:description" content="The ultimate Solana token creator. Create an SPL token, make a Solana coin, and use a cheap Solana token builder with no coding required." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SPLForge",
              "url": "https://splforge.xyz",
              "description": "The ultimate Solana token creator. Create an SPL token, make a Solana coin, and use a cheap Solana token builder with no coding required.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
