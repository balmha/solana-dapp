import type { NextPage } from "next";
import Head from "next/head";
import { DashboardView } from "../views";

const Dashboard: NextPage = (props) => {
  return (
    <div className="w-full h-full">
      <Head>
        <title>Create Solana Token | Create SPL Tokens easily - SPLForge</title>
        <meta
          name="description"
          content="Token Dashboard Functionality"
        />
      </Head>
      <DashboardView />
    </div>
  );
};

export default Dashboard;
