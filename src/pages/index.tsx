import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Create Solana Token | Create SPL Tokens easily - SPLForge</title>
        <meta
          name="description"
          content="Home"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
