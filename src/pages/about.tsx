import type { NextPage } from "next";
import Head from "next/head";
import { AboutView } from "../views";

const About: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Create Solana Token | Create SPL Tokens easily - SPLForge</title>
        <meta
          name="description"
          content="About us"
        />
      </Head>
      <AboutView />
    </div>
  );
};

export default About;
