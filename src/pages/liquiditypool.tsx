import type { NextPage } from "next";
import Head from "next/head";
import { LiquidityView } from "../views";

const Liquidity: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Create Solana Liquidity Pool | Fast SPL Token Deployment - SPLForge</title>
        <meta
          name="description"
          content="Easily create a liquidity pool for your Solana token. The fastest way to deploy Solana tokens and launch your project with SPLForge."
        />
        <meta property="og:title" content="Create Solana Liquidity Pool | Fast SPL Token Deployment - SPLForge" />
        <meta property="og:description" content="Easily create a liquidity pool for your Solana token. The fastest way to deploy Solana tokens and launch your project with SPLForge." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://splforge.xyz/liquiditypool" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create Solana Liquidity Pool | Fast SPL Token Deployment - SPLForge" />
        <meta name="twitter:description" content="Easily create a liquidity pool for your Solana token. The fastest way to deploy Solana tokens and launch your project with SPLForge." />
      </Head>
      <LiquidityView />
    </div>
  );
};

export default Liquidity;
