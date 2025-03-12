
import { FC } from "react";
import LiquidityPool from "components/LiquidityPool";

export const LiquidityView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4 md:p-16 flex flex-col md:flex-row justify-center items-center">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <LiquidityPool />
        </div>
      </div>
    </div>
  );
};
