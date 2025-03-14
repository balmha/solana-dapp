import type { NextPage } from "next";
import Head from "next/head";
import { CreatorView } from "../views";

const Creator: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Token Creator | Create SPL Tokens easily - SPLForge</title>
        <meta
          name="description"
          content="Token Creator Functionality"
        />
      </Head>
      <CreatorView />
    </div>
  );
};

export default Creator;
