import { FC } from 'react';
import LiquidityPool from 'components/LiquidityPool';

export const LiquidityView: FC = () => {
  return (
    <div className="md:hero my-10 md:my-0 2xl:mx-20 mx-auto p-4 md:p-8 lg:p-16 flex flex-col justify-center items-center">
      <div className="md:hero-content flex flex-col text-center w-full max-w-4xl">
        <LiquidityPool />
      </div>
    </div>
  );
};