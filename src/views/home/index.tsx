import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const HomeView: FC = () => {
  return (
    <div className="w-full my-20 xl:my-40 2xl:my-48 xl:mx-10 2xl:mx-32 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Logo Section */}
        <div className="flex justify-center">
          <Image
            src="/splforge-superlogo-nobackground.png"
            alt="SPLForge Logo"
            width={432}
            height={324}
            className="object-contain w-full max-w-[300px] md:max-w-[432px]"
          />
        </div>

        {/* Text and Buttons Section */}
        <div className="flex flex-col items-center text-center">
          <h4 className="text-2xl md:text-4xl text-slate-300 my-2">
            <p className="sourcesans-text text-slate-300 font-semibold">
              Create and Manage Tokens on Solana.
            </p>
            <br />
            <p className="sourcesans-text text-slate-300 text-2xl leading-relaxed">
              Easily create SPL tokens and liquidity pools with SPLForge.
            </p>
          </h4>
          <br />
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              href="/tokencreator"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded transition-colors"
            >
              Create Token
            </Link>
            <Link
              href="/liquiditypool"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded transition-colors"
            >
              Create Pool
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};