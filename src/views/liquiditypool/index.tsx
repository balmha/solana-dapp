import { FC } from "react";
import LiquidityPool from "components/LiquidityPool";

export const LiquidityView: FC = ({ }) => {
  return (
    <div className="md:hero mx-auto flex flex-col w-full h-full">
      {/* You can adjust padding here to be responsive */}
      <div className="p-[0.5rem] md:p-[4rem] lg:p-[0rem]">
        <LiquidityPool />
      </div>
    </div>
  );
};
