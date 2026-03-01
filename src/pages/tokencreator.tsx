import type { NextPage } from "next";
import Head from "next/head";
import { CreatorView } from "../views";

const Creator: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Create SPL Token | Fastest Way to Deploy Solana Tokens - SPLForge</title>
        <meta
          name="description"
          content="Use our Solana token creator to deploy your coin in seconds. It's the fastest way to deploy Solana tokens and manage your liquidity."
        />
        <meta property="og:title" content="Create SPL Token | Fastest Way to Deploy Solana Tokens - SPLForge" />
        <meta property="og:description" content="Use our Solana token creator to deploy your coin in seconds. It's the fastest way to deploy Solana tokens and manage your liquidity." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://splforge.xyz/tokencreator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create SPL Token | Fastest Way to Deploy Solana Tokens - SPLForge" />
        <meta name="twitter:description" content="Use our Solana token creator to deploy your coin in seconds. It's the fastest way to deploy Solana tokens and manage your liquidity." />
      </Head>
      <CreatorView />
    </div>
  );
};

export default Creator;
