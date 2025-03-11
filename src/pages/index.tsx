import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>SPLForge</title>
        <meta
          name="description"
          content="Home"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3&display=swap"
          rel="stylesheet"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
