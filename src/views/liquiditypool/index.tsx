import { FC } from 'react';
import LiquidityPool from 'components/LiquidityPool';

export const LiquidityView: FC = () => {
  return (
    <div className="md:hero-overlay max-h-0  my-14 flex flex-col w-full">
        <LiquidityPool />
      </div>
  );
};