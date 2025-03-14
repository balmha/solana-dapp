import type { NextPage } from "next";
import Head from "next/head";
import { DashboardView } from "../views";

const Dashboard: NextPage = (props) => {
  return (
    <div className="w-full h-full">
      <Head>
        <title>SPLForge</title>
        <meta
          name="description"
          content="Token Creator Functionality"
        />
      </Head>
      <DashboardView />
    </div>
  );
};

export default Dashboard;
