import { FC } from 'react';
import LiquidityPool from 'components/LiquidityPool';

export const LiquidityView: FC = () => {
  return (
    <div className="w-full my-20 xl:my-40 2xl:my-48 xl:mx-10 2xl:mx-32 flex flex-col items-center justify-center">
        <LiquidityPool />
      </div>
  );
};