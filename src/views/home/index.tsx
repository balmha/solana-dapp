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
            priority={true}
            className="object-contain w-full max-w-[300px] md:max-w-[432px]"
          />
        </div>

        {/* Text and Buttons Section */}
        <div className="flex flex-col items-center text-center">
          <div className="text-2xl md:text-5xl text-white my-2 font-bold tracking-tight">
            <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-2">
              Create and Manage<br />Tokens on Solana.
            </h1>
            <br />
            <h2 className="text-gray-400 text-xl md:text-2xl leading-relaxed font-medium max-w-2xl mt-4">
              Easily create SPL tokens and liquidity pools with SPLForge in seconds. No coding required.
            </h2>
          </div>
          <br />
          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <Link
              href="/tokencreator"
              className="bg-gradient-to-r from-purple-600 to-primary text-white hover:from-purple-500 hover:to-primary-focus hover:shadow-[0_0_30px_rgba(153,69,255,0.4)] border border-white/10 font-bold py-4 px-10 rounded-xl transition-all duration-300 text-lg relative overflow-hidden group"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative">Create Solana Tokens</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};