// Next, React
import { FC} from 'react';
import Link from 'next/link';
// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import Image from 'next/image';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  return (
    <div className="md:hero mx-auto p-4 md:pt-[1.5rem] md:pl-[10rem] flex flex-col md:flex-row justify-center items-center">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <Image
              src="/splforge-superlogo-nobackground.png"
              alt="SPLForge Logo"
              width={432}
              height={324}
              className="object-contain"
        />
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p className='sourcesans-text text-slate-300 font-semibold'>Create and Manage Tokens on Solana.</p><br></br>
          <p className='sourcesans-text text-slate-300 text-2x1 leading-relaxed'>Easily create SPL tokens and liquidity pools with SPLForge.</p>
        </h4>
        <br></br>
        <div className="space-x-4">
          <Link
            href="/tokencreator"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded"
          >
            Create Token
          </Link>
          <Link
            href="/liquiditypool"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded"
          >
            Create Pool
          </Link>
        </div>
      </div>
    </div>
  );
};