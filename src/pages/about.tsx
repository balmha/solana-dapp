import type { NextPage } from "next";
import Head from "next/head";
import { AboutView } from "../views";

const About: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>About Us | Solana Token Creator - SPLForge</title>
        <meta
          name="description"
          content="Learn about SPLForge, the leading Solana token generator. We offer a fast, cheap Solana token builder to easily create SPL tokens and liquidity pools."
        />
        <meta property="og:title" content="About Us | Solana Token Creator - SPLForge" />
        <meta property="og:description" content="Learn about SPLForge, the leading Solana token generator. We offer a fast, cheap Solana token builder to easily create SPL tokens and liquidity pools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://splforge.xyz/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Solana Token Creator - SPLForge" />
        <meta name="twitter:description" content="Learn about SPLForge, the leading Solana token generator. We offer a fast, cheap Solana token builder to easily create SPL tokens and liquidity pools." />
      </Head>
      <AboutView />
    </div>
  );
};

export default About;
