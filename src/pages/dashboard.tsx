import type { NextPage } from "next";
import Head from "next/head";
import { DashboardView } from "../views";

const Dashboard: NextPage = (props) => {
  return (
    <div className="w-full h-full">
      <Head>
        <title>Token Dashboard | SPLForge</title>
        <meta
          name="description"
          content="Manage your Solana tokens in the SPLForge Token Dashboard."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <DashboardView />
    </div>
  );
};

export default Dashboard;
