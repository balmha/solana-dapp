import { FC } from "react";
import TokenDashboard from "components/TokenDashboard";

export const DashboardView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4 md:p-8 lg:p-16 flex flex-col justify-center items-center">
      <div className="md:hero-content flex flex-col text-center w-full max-w-4xl">
          <TokenDashboard />
      </div>
    </div>
  );
};