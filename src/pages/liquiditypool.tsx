import type { NextPage } from "next";
import Head from "next/head";
import { LiquidityView } from "../views";

const Liquidity: NextPage = (props) => {
  return (
    <div className="md:hero mx-auto flex flex-col h-full pt-[3.5rem] pb-[0rem] pr-[0px] pl-[0px]">
      <Head>
        <title>Solana Token Creator | Create SPL Tokens easily - SPLForge</title>
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
