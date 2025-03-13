import React from "react";
import Image from 'next/image';

export const LiquidityPool = () => {
  return (
    <div
      id="webcrumbs"
      className="w-full min-h-[calc(100vh-64px-64px)] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="relative w-full h-full">
        <Image
          src="/under-construction.png"
          alt="Under Construction"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          quality={100}
        />
      </div>
    </div>
  );
};


export default LiquidityPool;