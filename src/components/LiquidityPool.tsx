// LiquidityPool.tsx
import React from "react";
import Image from 'next/image';

export const LiquidityPool = () => {
  return (
    <div className="relative w-full h-full">
      <Image
        src="/under-construction.png"
        alt="Under Construction"
        width={1920}
        height={1080}
        className="object-cover"
        quality={100}
      />
    </div>
  );
};

export default LiquidityPool;