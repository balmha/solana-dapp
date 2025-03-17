import type { NextPage } from "next";
import Head from "next/head";
import { LiquidityView } from "../views";

const Liquidity: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Create Solana Token | Create SPL Tokens easily - SPLForge</title>
        <meta
          name="description"
          content="Liquidity Pool Functionality"
        />
      </Head>
      <LiquidityView />
    </div>
  );
};

export default Liquidity;
